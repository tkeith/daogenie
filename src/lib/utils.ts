import { getGenieAddress } from "@/lib/blockchain/address";
import { NETWORKS } from "@/lib/blockchain/networks";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import assert from "assert";

export function parseOnChainProposalId(onChainProposalId: string) {
  const [chainId, proposalId] = onChainProposalId.split("-");
  assert(chainId && proposalId, "Invalid onChainProposalId");
  return { chainId: parseInt(chainId), proposalId: parseInt(proposalId) };
}

export function makeOnChainProposalId({
  chainId,
  proposalId,
}: {
  chainId: number;
  proposalId: number;
}) {
  return `${chainId}-${proposalId}`;
}

/**
 * intended to replicate ES2024 Promise.withResolvers:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
 */
export function promiseWithResolvers<T>() {
  // hacky solution to: https://github.com/microsoft/TypeScript/issues/45658
  //   (aka https://github.com/microsoft/TypeScript/issues/9998)
  let resolve = undefined as ((value: T | PromiseLike<T>) => void) | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let reject = undefined as ((reason?: any) => void) | undefined;
  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve;
    reject = innerReject;
  });
  assert(resolve !== undefined, "resolve must be defined");
  assert(reject !== undefined, "reject must be defined");
  return { promise, resolve, reject };
}

export function getRpcUrlByChainId(chainId: number) {
  const network = NETWORKS.find((n) => n.chainId === chainId);
  if (!network || !network.rpcUrls.length) {
    throw new Error(`No RPC URL found for chain ID ${chainId}`);
  }
  return network.rpcUrls[0]!;
}

export function useBlockchainUtils() {
  const { primaryWallet, network } = useDynamicContext();

  if (!primaryWallet || !network || typeof network !== "number") {
    return null;
  }

  const chainId = network;

  const contractAddress = getGenieAddress(chainId) as `0x${string}`;
}
