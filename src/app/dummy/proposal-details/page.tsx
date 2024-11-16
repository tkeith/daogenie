"use client";

import { DaoViewUi } from "@/components/dao-view-ui";
import { ProposalDetails } from "@/components/proposal-details-ui";

export default function TestProposalDetailsPage() {
  const dummyData = {
    daoId: 1,
    daoName: "Flamingo DAO",
    onSwitchDao: () => console.log("Switching DAO"),
    proposals: [
      {
        id: 1,
        title: "First Proposal",
        status: "Voting" as const,
        onSelect: () => console.log("Proposal 1 selected"),
        selected: false,
      },
      {
        id: 2,
        title: "Second Proposal",
        status: "Passed" as const,
        onSelect: () => console.log("Proposal 2 selected"),
        selected: false,
      },
      {
        id: 3,
        title: "Third Proposal",
        status: "Failed" as const,
        onSelect: () => console.log("Proposal 3 selected"),
        selected: true,
      },
    ],
    createProposalSelected: false,
    onSelectCreateProposal: () => console.log("Create proposal selected"),
    daoMainViewSelected: false,
    onSelectDaoMainView: () => console.log("Main view selected"),
    children: <div>Content goes here</div>,
  };

  return <DaoViewUi {...dummyData} />;
}
