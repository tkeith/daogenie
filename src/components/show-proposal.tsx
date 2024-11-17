"use client";

import { ABI } from "@/lib/blockchain/abi";
import { useGenieContext } from "@/lib/blockchain/genie-provider";
import { useAccount } from "wagmi";
import { useReadContract, useWriteContract } from "wagmi";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { makeOnChainProposalId } from "@/lib/utils";

interface ShowProposalProps {
  daoId: number;
  proposalId: number;
}

export function ShowProposal({ daoId, proposalId }: ShowProposalProps) {
  const { chainId, contractAddress, myAddress } = useGenieContext();
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [isVotingEnded, setIsVotingEnded] = useState(false);

  // Get dao details
  const { data: dao } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getDAO",
    args: [BigInt(daoId)],
  });

  // Get proposal details
  const { data: proposals } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getProposals",
    args: [BigInt(daoId)],
  });

  // Get user's voting status
  const { data: hasVoted } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getHasVoted",
    args: [BigInt(daoId), BigInt(proposalId), myAddress],
  });

  const { writeContract, isPending: isVoting } = useWriteContract();

  const proposal = proposals?.[proposalId];

  useEffect(() => {
    if (hasVoted !== undefined) {
      setHasUserVoted(hasVoted);
    }
  }, [hasVoted]);

  useEffect(() => {
    if (proposal) {
      const votingEndTime = new Date(Number(proposal.votingEndsAt) * 1000);
      setIsVotingEnded(new Date() > votingEndTime);
    }
  }, [proposal]);

  const launchExecutionMutation = api.launchExecution.useMutation();

  if (!dao) {
    return <div>Loading...</div>;
  }

  if (!proposal) {
    return <div>Loading...</div>;
  }

  const handleVote = async () => {
    writeContract({
      abi: ABI,
      address: contractAddress,
      functionName: "voteOnProposal",
      args: [BigInt(daoId), BigInt(proposalId)],
    });

    await launchExecutionMutation.mutateAsync({
      onChainProposalId: makeOnChainProposalId({ chainId, proposalId }),
      proposalTitle: proposal.title,
      proposalDescription: proposal.description,
      treasuryAddress: dao.treasuryAddress,
    });
  };

  const getProposalStatus = () => {
    if (proposal.passed) return "Passed";
    if (isVotingEnded) return "Failed";
    return "Voting in Progress";
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const progressPercentage =
    (Number(proposal.yesVotes) / Number(proposal.votesNeededToPass)) * 100;

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{proposal.title}</h1>
        <p className="whitespace-pre-wrap text-gray-600">
          {proposal.description}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 rounded-lg bg-gray-100 p-4">
          <p>
            Status: <span className="font-semibold">{getProposalStatus()}</span>
          </p>
          <p>Created: {formatDate(Number(proposal.createdAt))}</p>
          <p>Voting Ends: {formatDate(Number(proposal.votingEndsAt))}</p>
          <p>Created by: {proposal.creator}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>
              Progress: {proposal.yesVotes.toString()} /{" "}
              {proposal.votesNeededToPass.toString()} votes
            </span>
            <span>{Math.min(100, progressPercentage).toFixed(1)}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-blue-600"
              style={{ width: `${Math.min(100, progressPercentage)}%` }}
            ></div>
          </div>
        </div>

        {!isVotingEnded && !hasUserVoted && myAddress && (
          <button
            onClick={handleVote}
            disabled={isVoting}
            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isVoting ? "Voting..." : "Vote Yes"}
          </button>
        )}

        {hasUserVoted && (
          <p className="text-center text-green-600">
            You have already voted on this proposal
          </p>
        )}

        {!myAddress && (
          <p className="text-center text-gray-600">
            Connect your wallet to vote
          </p>
        )}
      </div>
    </div>
  );
}
