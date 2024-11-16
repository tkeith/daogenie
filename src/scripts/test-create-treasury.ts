import { db } from "@/server/db";
import { ethers } from "ethers";

async function main() {
  // Create a new random wallet
  const wallet = ethers.Wallet.createRandom();

  // Create the treasury in the database
  const treasury = await db.treasury.create({
    data: {
      address: wallet.address,
      privateKey: wallet.privateKey,
    },
  });

  console.log("Created treasury:", {
    id: treasury.id,
    address: treasury.address,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
