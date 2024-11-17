"use client";

import { api } from "@/trpc/react";
import { CreateDaoUi } from "./create-dao-ui";
import { useGenieContext } from "@/lib/blockchain/genie-provider";
import { ABI } from "@/lib/blockchain/abi";
import { Chain } from "viem";
import { assert } from "console";

export default function CreateDao({
  afterCreate,
}: {
  afterCreate: () => void;
}) {
  const createTreasuryMutation = api.createTreasury.useMutation();
  const { chainId, contractAddress, walletClient, ethereumWallet, myAddress } =
    useGenieContext();

  async function onSubmit(name: string) {
    // get treasury
    const treasury = await createTreasuryMutation.mutateAsync();
    const treasuryAddress = treasury.address;
    const res = await walletClient.writeContract({
      abi: ABI,
      address: contractAddress,
      functionName: "createDAO",
      args: [name, treasuryAddress as `0x${string}`],
      chain: { id: chainId } as Chain,
      account: myAddress,
    });
    console.log("writeContract res in create-dao: ", res);
    afterCreate();
  }

  return <CreateDaoUi onSubmit={onSubmit} />;
}
