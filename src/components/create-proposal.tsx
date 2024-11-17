"use client";

import { useState } from "react";
import { useGenieContext } from "@/lib/blockchain/genie-provider";
import { ABI } from "@/lib/blockchain/abi";
import { Chain } from "viem";

interface CreateProposalProps {
  daoId: number;
}

interface CreateProposalUiProps {
  onSubmit: (title: string, description: string) => Promise<void>;
  isSubmitting: boolean;
}

// UI Component
function CreateProposalUi({ onSubmit, isSubmitting }: CreateProposalUiProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(title, description);
    // Reset form
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Proposal Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Proposal Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? "Creating Proposal..." : "Create Proposal"}
      </button>
    </form>
  );
}

// Main Component
export function CreateProposal({ daoId }: CreateProposalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { chainId, contractAddress, walletClient, myAddress } =
    useGenieContext();

  const handleSubmit = async (title: string, description: string) => {
    try {
      setIsSubmitting(true);
      const res = await walletClient.writeContract({
        abi: ABI,
        address: contractAddress,
        functionName: "createProposal",
        args: [BigInt(daoId), title, description],
        chain: { id: chainId } as Chain,
        account: myAddress,
      });
      console.log("Proposal created:", res);
    } catch (error) {
      console.error("Error creating proposal:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CreateProposalUi onSubmit={handleSubmit} isSubmitting={isSubmitting} />
  );
}
