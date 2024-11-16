"use client";

import { ProposalDetails } from "@/components/proposal-details";

export default function TestProposalDetailsPage() {
  const dummyProposal = {
    id: 123,
    title: "Purchase 10 NFTs from Bored Ape Collection",
    status: "Voting" as const,
  };

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-lg bg-gray-50 p-6">
        <ProposalDetails {...dummyProposal} />
      </div>
    </div>
  );
}
