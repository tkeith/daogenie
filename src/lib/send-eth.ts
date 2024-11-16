import { Wallet, parseEther, JsonRpcProvider } from "ethers";

export async function sendEth({
  privateKey,
  to,
  amount,
}: {
  privateKey: string;
  to: string;
  amount: string;
}) {
  // Create provider instance
  const provider = new JsonRpcProvider("https://eth.llamarpc.com");

  // Create wallet instance from private key and connect it to the provider
  const wallet = new Wallet(privateKey, provider);

  // Create transaction object
  const tx = {
    to: to,
    value: parseEther(amount),
  };

  // Send transaction
  const txResponse = await wallet.sendTransaction(tx);

  // log txn id
  console.log("txn id", txResponse.hash);
  // Wait for transaction to be mined
  const receipt = await txResponse.wait();

  return txResponse.hash;
}
