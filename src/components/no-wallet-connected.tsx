"use client";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export function NoWalletConnected() {
  return (
    <>
      <p>Connect your wallet to log in.</p>
      <DynamicWidget />
    </>
  );
}
