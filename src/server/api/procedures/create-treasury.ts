import { procedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { ethers } from "ethers";

export const createTreasury = procedure.mutation(async ({}) => {
  const wallet = ethers.Wallet.createRandom();

  const newTreasury = await db.treasury.create({
    data: {
      address: wallet.address,
      privateKey: wallet.privateKey,
    },
  });

  return {
    address: newTreasury.address,
  };
});
