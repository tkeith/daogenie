"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";

export function CreateDaoUi({
  onSubmit,
  onCancel,
}: {
  onSubmit: (name: string) => void;
  onCancel: () => void; //trevor-todo: add onCancel
}) {
  const { register, handleSubmit } = useForm<{ name: string }>();

  return (
    <div className="flex h-screen flex-col items-center bg-[#EEEDF6] px-12 pt-20">
      {/* Logo */}
      <Image
        src="/dao-genie-logo-2.png"
        alt="DAO Genie Logo"
        width={1024}
        height={256}
        priority
        className="mb-8 h-20 w-auto"
      />

      {/* Container for form */}
      <div className="w-full max-w-md">
        <p className="mb-4 text-xl font-medium text-gray-800">
          Name for the new DAO:
        </p>

        <form
          onSubmit={handleSubmit((data) => onSubmit(data.name))}
          className="space-y-4"
        >
          <input
            type="text"
            id="name"
            {...register("name", { required: true })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#5B51F6] focus:outline-none focus:ring-1 focus:ring-[#5B51F6]"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="mb-2 w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mb-2 w-full rounded-lg bg-[#5B51F6] px-6 py-3 text-white transition-colors duration-200 hover:bg-[#4f46e5]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
