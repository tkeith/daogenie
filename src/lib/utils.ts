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
