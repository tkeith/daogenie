"use client";

import { DaoMainViewUi } from "@/components/dao-main-view-ui";
import { DaoViewUi } from "@/components/dao-view-ui/dao-view-ui";
import { ABI } from "@/lib/blockchain/abi";
import { useGenieContext } from "@/lib/blockchain/genie-provider";
import { useState } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { CreateProposal } from "@/components/create-proposal";
import { DaoMain } from "@/components/dao-main";
import { ShowProposal } from "@/components/show-proposal";

export function ShowDao({ daoId }: { daoId: number }) {
  // State management for selected views
  const [createProposalSelected, setCreateProposalSelected] = useState(false);
  const [daoMainViewSelected, setDaoMainViewSelected] = useState(true);
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(
    null,
  );
  const { chainId, contractAddress } = useGenieContext();

  const { data: dao } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getDAO",
    args: [BigInt(daoId)],
  });

  // Get the number of proposals for this DAO
  const { data: rawProposals } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getProposals",
    args: [BigInt(daoId)],
  });

  if (!dao || !rawProposals) {
    return <div>Loading...</div>;
  }

  const proposals = rawProposals.map((proposal) => ({
    id: Number(proposal.id),
    title: proposal.title,
    status: proposal.passed
      ? ("Passed" as const)
      : new Date(Number(proposal.votingEndsAt) * 1000) > new Date()
        ? ("Voting" as const)
        : ("Failed" as const),
    onSelect: () => {
      console.log(`Selected proposal ${proposal.id}`);
      setCreateProposalSelected(false);
      setDaoMainViewSelected(false);
      setSelectedProposalId(Number(proposal.id));
    },
    selected: selectedProposalId === Number(proposal.id),
    description: proposal.description,
    createdAt: Number(proposal.createdAt),
    votingEndsAt: Number(proposal.votingEndsAt),
    creator: proposal.creator,
    yesVotes: Number(proposal.yesVotes),
    votesNeededToPass: Number(proposal.votesNeededToPass),
  }));

  return (
    <DaoViewUi
      daoId={daoId}
      daoName={dao.name}
      proposals={proposals}
      createProposalSelected={createProposalSelected}
      onSelectCreateProposal={() => {
        setCreateProposalSelected(true);
        setDaoMainViewSelected(false);
        setSelectedProposalId(null);
      }}
      daoMainViewSelected={daoMainViewSelected}
      onSelectDaoMainView={() => {
        setDaoMainViewSelected(true);
        setCreateProposalSelected(false);
        setSelectedProposalId(null);
      }}
      onSwitchDao={() => {
        // Handle DAO switching logic
        console.log("Switching DAO");
      }}
    >
      {/* Content for the right panel */}
      <div>
        {createProposalSelected ? (
          <CreateProposal daoId={daoId} />
        ) : selectedProposalId === null ? (
          <DaoMain daoId={daoId} />
        ) : (
          <ShowProposal daoId={daoId} proposalId={selectedProposalId} />
        )}
      </div>
    </DaoViewUi>
  );
}
