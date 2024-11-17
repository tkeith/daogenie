"use client";

import CreateDao from "@/components/create-dao";
import { DaoSelectUi } from "@/components/dao-select-ui";
import { ABI } from "@/lib/blockchain/abi";
import { getGenieAddress } from "@/lib/blockchain/address";
import { useGenieContext } from "@/lib/blockchain/genie-provider";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import { useReadContract, useReadContracts } from "wagmi";

export function DaoSelect({ onSelect }: { onSelect: (daoId: number) => void }) {
  const [creatingDao, setCreatingDao] = useState(false);

  if (creatingDao) {
    return (
      <CreateDao
        afterCreate={() => {
          setCreatingDao(false);
        }}
      />
    );
  }

  return (
    <NotCreatingDao
      onSelect={onSelect}
      onSelectCreateDao={() => setCreatingDao(true)}
    />
  );
}

function NotCreatingDao({
  onSelect,
  onSelectCreateDao,
}: {
  onSelect: (daoId: number) => void;
  onSelectCreateDao: () => void;
}) {
  // const { primaryWallet, network } = useDynamicContext();

  // if (
  //   !primaryWallet ||
  //   !isEthereumWallet(primaryWallet) ||
  //   !(network && typeof network === "number")
  // ) {
  //   return null;
  // }

  // const chainId = network;

  const { ethereumWallet, chainId } = useGenieContext();

  const { data: numberOfDaos } = useReadContract({
    address: getGenieAddress(chainId) as `0x${string}`,
    abi: ABI,
    functionName: "getDaosLength",
    args: [],
  });

  console.log("numberOfDaos", numberOfDaos);

  const { data: rawDaos } = useReadContracts({
    contracts: Array.from({ length: Number(numberOfDaos || 0) }).map(
      (_, index) => ({
        address: getGenieAddress(chainId) as `0x${string}`,
        abi: ABI,
        functionName: "daos",
        args: [BigInt(index)],
      }),
    ),
  });

  console.log("rawDaos", rawDaos);

  if (!rawDaos) {
    return null;
  }

  let daos: {
    id: number;
    createdAt: number;
    name: string;
    creator: `0x${string}`;
    totalVotes: number;
    numberOfMembers: number;
    numberOfProposals: number;
    treasuryAddress: `0x${string}`;
  }[] = [];

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < rawDaos.length; i++) {
    const dao = rawDaos[i]!;
    if (dao.status === "success") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const daoAsAny = dao.result as any;
      daos.push({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: daoAsAny[0],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        createdAt: daoAsAny[1],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        name: daoAsAny[2],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        creator: daoAsAny[3],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        totalVotes: daoAsAny[4],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        numberOfMembers: daoAsAny[5],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        numberOfProposals: daoAsAny[6],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        treasuryAddress: daoAsAny[7],
      });
    }
  }

  // get each dao details by reading daos[i]

  return (
    <DaoSelectUi
      daos={daos.map((dao) => ({
        ...dao,
        onSelect: () => onSelect(dao.id),
      }))}
      onSelectCreateDao={onSelectCreateDao}
    />
  );
}
