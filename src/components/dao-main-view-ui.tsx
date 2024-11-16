"use client";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export type DaoMainViewUiInput = {
  name: string;
  createdAt: string;
  creatorWalletAddress: string;
  DaoWalletAddress: string;
  balance: number;
  totalVotes: number;
  members: {
    walletAddress: string;
    votes: number;
  }[];
  OnSubmitAddMember: () => void;
  OnDeleteMember: (walletAddress: string) => void;
};

export function DaoMainViewUi({
  name,
  createdAt,
  creatorWalletAddress,
  DaoWalletAddress,
  balance,
  totalVotes,
  members,
  OnSubmitAddMember,
}: DaoMainViewUiInput) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [newMemberVotes, setNewMemberVotes] = useState("");

  // Calculate total allocated votes
  const allocatedVotes = members.reduce((sum, member) => sum + member.votes, 0);
  const remainingVotes = totalVotes - allocatedVotes;

  const handleSubmitNewMember = () => {
    const newVotes = parseInt(newMemberVotes);
    if (newVotes > remainingVotes) {
      alert(`Cannot allocate more than ${remainingVotes} remaining votes`);
      return;
    }
    OnSubmitAddMember();
    setIsAddingMember(false);
    setNewMemberAddress("");
    setNewMemberVotes("");
  };

  return (
    <div className="h-full">
      <h1 className="mb-6 text-2xl font-bold">Summary</h1>

      {/* DAO details table */}
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                Name
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {name}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                Created At
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {createdAt}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                Creator Wallet Address
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {creatorWalletAddress}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                DAO Wallet Address
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {DaoWalletAddress}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                Balance
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {balance}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Members section */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Members</h2>
            <div className="mt-2 text-sm text-gray-600">
              Remaining Votes:{" "}
              <span className="font-medium text-green-500">
                {remainingVotes}
              </span>{" "}
              out of <span className="text-gray-500">{totalVotes}</span>
            </div>
          </div>
          {!isAddingMember && remainingVotes > 0 && (
            <button
              onClick={() => setIsAddingMember(true)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add New Member
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Wallet Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Votes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {members.map((member, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {member.walletAddress}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {member.votes}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <button
                      className="text-gray-400 hover:text-red-500 focus:outline-none"
                      title="Delete member"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {isAddingMember && (
                <tr>
                  <td className="whitespace-nowrap px-6 py-4">
                    <input
                      type="text"
                      value={newMemberAddress}
                      onChange={(e) => setNewMemberAddress(e.target.value)}
                      placeholder="Enter wallet address"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <input
                      type="number"
                      value={newMemberVotes}
                      onChange={(e) => setNewMemberVotes(e.target.value)}
                      placeholder={`Max ${remainingVotes}`}
                      max={remainingVotes}
                      className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSubmitNewMember}
                        className="rounded-lg bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingMember(false);
                          setNewMemberAddress("");
                          setNewMemberVotes("");
                        }}
                        className="rounded-lg bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
