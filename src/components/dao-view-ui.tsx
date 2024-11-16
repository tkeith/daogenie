export type DaoViewUiInput = {
  daoId: number;
  daoName: string;
  proposals: {
    id: number;
    title: string;
    status: "Voting" | "Passed" | "Failed";
  }[];
  selectedProposalId: number | null; // when null selected, we're showing the DAO main panel
  onSelectProposal: (daoId: number, proposalId: number) => void;
  children: React.ReactNode;
};

/**
 * this should show the main two-panel view once we're showing a DAO, and render the children inside the right side of the panel
 */
export function DaoViewUi({
  daoId,
  daoName,
  proposals,
  selectedProposalId,
  onSelectProposal,
  children,
}: DaoViewUiInput) {
  // todo-riley
  return <div>{children}</div>;
}
