"use client";

import { DaoSelectUi } from "@/components/dao-select-ui";
import { ABI } from "@/lib/blockchain/abi";
import { getAddress } from "@/lib/blockchain/address";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import { useReadContract, useReadContracts } from "wagmi";

export function DaoSelect({ onSelect }: { onSelect: (daoId: number) => void }) {
  const [creatingDao, setCreatingDao] = useState(false);

  if (creatingDao) {
    return <div>Creating dao...</div>;
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
  const { primaryWallet, network } = useDynamicContext();

  if (
    !primaryWallet ||
    !isEthereumWallet(primaryWallet) ||
    !(network && typeof network === "number")
  ) {
    return null;
  }

  const chainId = network;

  const { data: numberOfDaos } = useReadContract({
    address: getAddress(chainId) as `0x${string}`,
    abi: ABI,
    functionName: "getDaosLength",
    args: [],
  });

  console.log("numberOfDaos", numberOfDaos);

  const { data: daos } = useReadContracts({
    contracts: Array.from({ length: Number(numberOfDaos || 0) }).map(
      (_, index) => ({
        address: getAddress(chainId) as `0x${string}`,
        abi: ABI,
        functionName: "daos",
        args: [BigInt(index)],
      }),
    ),
  });

  console.log("daos", daos);

  // get each dao details by reading daos[i]

  return <DaoSelectUi daos={[]} onSelectCreateDao={onSelectCreateDao} />;
}
