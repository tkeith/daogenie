"use client";

import Image from "next/image";

export type DaoSelectUiInput = {
  daos: {
    name: string;
    onSelect: () => void;
  }[];
  onSelectCreateDao: () => void;
};

export function DaoSelectUi({ daos, onSelectCreateDao }: DaoSelectUiInput) {
  return (
    <div className="flex h-screen flex-col items-center bg-[#EEEDF6] px-12 pt-20">
      {/* Logo
      //todo for trevor: the page is scrollable now
       */}
      <Image
        src="/dao-genie-logo-2.png"
        alt="DAO Genie Logo"
        width={1024}
        height={256}
        priority
        className="mb-8 h-20 w-auto"
      />

      {/* Container for heading and list */}
      <div className="w-full max-w-md">
        {/* Heading */}
        <p className="mb-4 text-xl font-medium text-gray-800">
          Select a DAO to continue:
        </p>

        {/* DAOs List */}
        <div className="mb-6 space-y-3">
          {daos.map((dao, index) => (
            <button
              key={index}
              onClick={dao.onSelect}
              className="w-full rounded-lg border border-gray-200 bg-white p-4 text-center shadow transition-shadow duration-200 hover:shadow-md"
            >
              {dao.name}
            </button>
          ))}
        </div>
      </div>

      {/* Create DAO Button */}
      <button
        onClick={onSelectCreateDao}
        className="rounded-lg bg-[#5B51F6] px-6 py-3 text-white transition-colors duration-200 hover:bg-[#4f46e5]"
      >
        Create New DAO
      </button>
    </div>
  );
}
