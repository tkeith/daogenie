import { JsonRpcProvider } from "ethers";

export async function clientGetEthBalance(address: string) {
  const provider = new JsonRpcProvider("https://eth.llamarpc.com");
  const balance = await provider.getBalance(address);
  return balance;
}
