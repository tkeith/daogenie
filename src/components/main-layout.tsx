"use client";

import { TRPCReactProvider } from "@/trpc/react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { NoWalletConnected } from "@/components/no-wallet-connected";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";
import { CustomizedDynamicContextProvider } from "@/components/dynamic-context-provider";
import { AuthedLayout } from "@/components/authed-layout";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <TRPCReactProvider>
        <CustomizedDynamicContextProvider>
          <MainLayoutInner>{children}</MainLayoutInner>
        </CustomizedDynamicContextProvider>
      </TRPCReactProvider>
      <Toaster />
    </>
  );
}

function MainLayoutInner({ children }: { children: React.ReactNode }) {
  const dynamicContext = useDynamicContext();

  return (
    <>
      {dynamicContext.authToken === undefined ? (
        <NoWalletConnected />
      ) : (
        <AuthedLayout>{children}</AuthedLayout>
      )}
    </>
  );
}
