"use client";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export type CreateProposalUiInput = {
  OnSubmitProposal: (title: string, description: string) => void;
};

export function CreateProposalUi({ OnSubmitProposal }: CreateProposalUiInput) {
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    OnSubmitProposal(proposalTitle, proposalDescription);
  };

  return (
    <div className="h-full">
      <h1 className="mb-6 text-2xl font-bold">New Proposal</h1>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#5B51F6] focus:outline-none focus:ring-1 focus:ring-[#5B51F6]"
              required
            />
          </div>
          <div className="px-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Description
            </label>
            <textarea
              id="description"
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#5B51F6] focus:outline-none focus:ring-1 focus:ring-[#5B51F6]"
              required
            />
          </div>
          <div className="flex items-center justify-end bg-white px-6 py-4">
            <button
              type="submit"
              className="rounded-lg bg-[#5B51F6] px-4 py-2 text-white hover:bg-[#4A41E0] focus:outline-none focus:ring-2 focus:ring-[#5B51F6] focus:ring-offset-2"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
