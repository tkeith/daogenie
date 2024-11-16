type ProposalDetailsInput = {
  id: number;
  title: string;
  status: "Voting" | "Passed" | "Failed";
};

export function ProposalDetails({ id, title, status }: ProposalDetailsInput) {
  return (
    <div className="h-full">
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>

      <div className="mb-4">
        <span className="mr-2 font-semibold">Status:</span>
        <span
          className={`inline-block rounded-full px-3 py-1 text-sm ${
            status === "Voting"
              ? "bg-blue-100 text-blue-800"
              : status === "Passed"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Placeholder for additional proposal details */}
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-gray-600">Proposal ID: {id}</p>
        {/* Add more proposal details here as needed */}
      </div>
    </div>
  );
}
