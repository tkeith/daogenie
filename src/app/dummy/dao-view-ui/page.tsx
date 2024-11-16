"use client";

import { DaoViewUi } from "@/components/dao-view-ui/dao-view-ui";

export const DUMMY_DAO_VIEW_UI_PROPS = {
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
      selected: false,
    },
  ],
  createProposalSelected: false,
  onSelectCreateProposal: () => console.log("Create proposal selected"),
  daoMainViewSelected: false,
  onSelectDaoMainView: () => console.log("Main view selected"),
};

export default function TestUiPage() {
  return <DaoViewUi {...DUMMY_DAO_VIEW_UI_PROPS}>Content goes here</DaoViewUi>;
}
