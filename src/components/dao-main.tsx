"use client";

import { DaoMainViewUi } from "@/components/dao-main-view-ui";
import { ABI } from "@/lib/blockchain/abi";
import { useGenieContext } from "@/lib/blockchain/genie-provider";
import { useCallback, useEffect, useState } from "react";
import { useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { formatEther } from "viem";
import { clientGetEthBalance } from "@/lib/client-get-eth-balance";

export function DaoMain({ daoId }: { daoId: number }) {
  const { chainId, contractAddress } = useGenieContext();
  const { writeContractAsync } = useWriteContract();
  const [treasuryBalance, setTreasuryBalance] = useState<number | null>(null);

  // Get DAO details
  const { data: dao } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getDAO",
    args: [BigInt(daoId)],
  });

  // Get DAO members
  const { data: memberAddresses } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getDaoMembers",
    args: [BigInt(daoId)],
  });

  // Get votes for each member
  const { data: memberVotes } = useReadContracts({
    contracts:
      memberAddresses?.map((address) => ({
        abi: ABI,
        address: contractAddress,
        functionName: "getDaoVotes",
        args: [BigInt(daoId), address],
      })) ?? [],
  });

  // useEffect to get treasury balance
  useEffect(() => {
    const getTreasuryBalance = async () => {
      const balance = await clientGetEthBalance(dao?.treasuryAddress ?? "");
      setTreasuryBalance(Number(formatEther(balance)));
    };
    void getTreasuryBalance();
  }, [dao?.treasuryAddress]);

  const handleUpdateMemberVotes = useCallback(
    async (toAddress: string, newVotes: number) => {
      if (!dao) return;

      try {
        await writeContractAsync({
          abi: ABI,
          address: contractAddress,
          functionName: "reallocateVotes",
          args: [BigInt(daoId), toAddress as `0x${string}`, BigInt(newVotes)],
        });
      } catch (error) {
        console.error("Failed to update member votes:", error);
      }
    },
    [dao, contractAddress, daoId, writeContractAsync],
  );

  if (!dao || !memberAddresses || !memberVotes || treasuryBalance === null) {
    return (
      <div>
        Loading...
        {JSON.stringify(
          {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            dao: dao && dao.toString(),
            memberAddresses,
            memberVotes: memberVotes && memberVotes?.toString(),
            treasuryBalance,
          },
          null,
          2,
        )}
      </div>
    );
  }

  const members = memberAddresses.map((address, index) => ({
    walletAddress: address,
    votes: Number(memberVotes[index]?.result || 0),
  }));

  return (
    <DaoMainViewUi
      name={dao.name}
      createdAt={new Date(Number(dao.createdAt) * 1000).toLocaleString()}
      creatorWalletAddress={dao.creator}
      daoWalletAddress={dao.treasuryAddress}
      balance={treasuryBalance}
      totalVotes={Number(dao.totalVotes)}
      members={members}
      onUpdateMemberVotes={handleUpdateMemberVotes}
    />
  );
}
