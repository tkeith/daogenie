"use client";

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
      onClick={() => {
        onSelect();
        selected = true;
      }}
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
