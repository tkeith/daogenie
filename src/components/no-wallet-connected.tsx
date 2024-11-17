"use client";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Image from "next/image";

export function NoWalletConnected() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EEEDF6]">
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-8">
        {/* Logo */}
        <Image
          src="/dao-genie-logo-2.png"
          alt="DAO Genie Logo"
          width={1024}
          height={256}
          priority
          className="mb-8 h-20 w-auto"
        />

        {/* Container for content */}
        <div className="w-full max-w-md text-center">
          <p className="mb-4 text-xl font-medium text-gray-800">
            Connect your wallet to log in.
          </p>
          <div className="w-full">
            <div className="inline-block">
              <DynamicWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
