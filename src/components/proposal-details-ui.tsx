"use client";

export type ProposalDetailsUiInput = {
  votesRequired: number;
  currentVotes: number;
  votedStatus: boolean;
  proposal: {
    id: number;
    title: string;
    status: "Voting" | "Passed" | "Failed";
    description: string;
    votesReceived: number;
    createdAt: string;
    creatorWalletAddress: string;
  };
  OnSelectedYes: () => void;
  OnSelectedNo: () => void;
};

export function ProposalDetailsUi({
  votesRequired,
  currentVotes,
  votedStatus,
  proposal,
  OnSelectedYes,
  OnSelectedNo,
}: ProposalDetailsUiInput) {
  const showVoteButtons = proposal.status === "Voting" && !votedStatus;

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "Voting":
        return "bg-blue-500";
      case "Passed":
        return "bg-green-500";
      case "Failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="h-full">
      <h1 className="mb-6 text-2xl font-bold">{proposal.title}</h1>

      <div className="mb-4">
        <span className="mr-2 font-semibold">Status:</span>
        <span
          className={`inline-block rounded-full px-3 py-1 text-sm ${
            proposal.status === "Voting"
              ? "bg-blue-100 text-blue-800"
              : proposal.status === "Passed"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {proposal.status}
        </span>

        {/* Progress bar for all statuses */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{proposal.votesReceived} votes</span>
            <span>{votesRequired} required</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${getProgressBarColor(
                proposal.status,
              )}`}
              style={{
                width: `${Math.min(
                  (proposal.votesReceived / votesRequired) * 100,
                  100,
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Vote buttons */}
      {showVoteButtons && (
        <div className="mb-6 flex space-x-4">
          <button
            onClick={OnSelectedYes}
            className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Vote Yes (+{currentVotes})
          </button>
          <button
            onClick={OnSelectedNo}
            className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Vote No
          </button>
        </div>
      )}

      {/* Proposal details table */}
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                Description
              </td>
              <td className="whitespace-pre-wrap px-6 py-4 text-sm text-gray-500">
                {proposal.description}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                Created At
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {proposal.createdAt}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                Creator Address
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {proposal.creatorWalletAddress}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                Voted or Not
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                {votedStatus ? (
                  <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                    Yes
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                    No
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Voting information */}
    </div>
  );
}
