export type DaoViewUiInput = {
  daoId: number;
  daoName: string;
  proposals: {
    id: number;
    title: string;
    status: "Voting" | "Passed" | "Failed";
    onSelect: () => void;
    selected: boolean;
  }[];
  createProposalSelected: boolean;
  onSelectCreateProposal: () => void;
  daoMainViewSelected: boolean;
  onSelectDaoMainView: () => void;
  children: React.ReactNode;
};

/**
 * this should show the main two-panel view once we're showing a DAO, and render the children inside the right side of the panel
 */
export function DaoViewUi({
  daoId,
  daoName,
  proposals,
  createProposalSelected,
  onSelectCreateProposal,
  daoMainViewSelected,
  onSelectDaoMainView,
  children,
}: DaoViewUiInput) {
  // todo-riley
  return <div>{children}</div>;
}
