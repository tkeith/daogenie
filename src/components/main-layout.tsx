"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { NoWalletConnected } from "@/components/no-wallet-connected";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const dynamicContext = useDynamicContext();

  return (
    <>
      {dynamicContext.authToken === undefined ? (
        <NoWalletConnected />
      ) : (
        children
      )}
    </>
  );
}
