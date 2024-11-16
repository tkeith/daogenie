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
  OnUpdateMemberVotes: (walletAddress: string, newVotes: number) => void;
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
  OnUpdateMemberVotes,
}: DaoMainViewUiInput) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [newMemberVotes, setNewMemberVotes] = useState("");
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editingVotes, setEditingVotes] = useState("");

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

  const handleUpdateVotes = (walletAddress: string) => {
    const newVotes = parseInt(editingVotes);
    const currentMember = members.find(
      (m) => m.walletAddress === walletAddress,
    );
    const otherMembersVotes = members.reduce(
      (sum, m) => (m.walletAddress === walletAddress ? sum : sum + m.votes),
      0,
    );

    if (newVotes + otherMembersVotes > totalVotes) {
      alert(
        `Cannot allocate more than ${totalVotes - otherMembersVotes} votes`,
      );
      return;
    }

    OnUpdateMemberVotes(walletAddress, newVotes);
    setEditingMember(null);
    setEditingVotes("");
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
                    {editingMember === member.walletAddress ? (
                      <input
                        type="number"
                        value={editingVotes}
                        onChange={(e) => setEditingVotes(e.target.value)}
                        className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      member.votes
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {editingMember === member.walletAddress ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleUpdateVotes(member.walletAddress)
                          }
                          className="rounded-lg bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingMember(null);
                            setEditingVotes("");
                          }}
                          className="rounded-lg bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingMember(member.walletAddress);
                          setEditingVotes(member.votes.toString());
                        }}
                        className="text-gray-400 hover:text-blue-500 focus:outline-none"
                        title="Edit votes"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                    )}
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
