"use client";

import { ProposalDetails } from "./proposal-details-ui";

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
  onSwitchDao: () => void;
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
  onSwitchDao,
  children,
}: DaoViewUiInput) {
  const selectedProposal = proposals.find((p) => p.selected);

  return (
    <div className="flex w-full gap-4">
      {/* Left column - 1/3 width */}
      <div className="w-1/3 rounded-lg bg-gray-50 p-4">
        {/* DAO Info Card */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={onSelectDaoMainView}
              className={`text-left text-2xl font-bold text-[#5B51F6] hover:underline ${
                daoMainViewSelected ? "underline" : ""
              }`}
            >
              {daoName}
            </button>
            <a
              onClick={onSwitchDao}
              className="text-sm text-[#5B51F6] hover:underline"
            >
              Switch
            </a>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Proposals</h2>
          <button
            onClick={onSelectCreateProposal}
            className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
              createProposalSelected
                ? "bg-[#5B51F6] text-white"
                : "bg-[#5B51F6] text-white hover:bg-[#4f46e5]"
            }`}
          >
            Create New Proposal
          </button>
        </div>
        <div className="space-y-2">
          {proposals.map((proposal) => (
            <Proposal key={proposal.id} {...proposal} />
          ))}
        </div>
      </div>

      {/* Right column - 2/3 width */}
      <div className="w-2/3 rounded-lg bg-gray-50 p-4">
        {selectedProposal ? (
          <ProposalDetails
            id={selectedProposal.id}
            title={selectedProposal.title}
            status={selectedProposal.status}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}

type ProposalProps = {
  id: number;
  title: string;
  status: "Voting" | "Passed" | "Failed";
  onSelect: () => void;
  selected: boolean;
};

export function Proposal({ title, status, onSelect, selected }: ProposalProps) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded p-3 ${
        selected
          ? "border-2 border-blue-500 bg-blue-100"
          : "bg-white hover:bg-gray-100"
      }`}
    >
      <h3 className="font-medium">{title}</h3>
      <span
        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
          status === "Passed"
            ? "bg-green-100 text-green-800"
            : status === "Failed"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
