import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { MainLayout } from "@/components/main-layout";
import { TRPCReactProvider } from "@/trpc/react";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { env } from "@/env";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "DAO Genie",
  description: "", // todo-riley
  icons: [
    // todo-riley
    // place favicon.ico in public folder and uncomment the following line
    // { rel: "icon", url: "/favicon.ico" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <DynamicContextProvider
            settings={{
              environmentId: env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
              walletConnectors: [EthereumWalletConnectors],
            }}
          >
            <MainLayout>{children}</MainLayout>
          </DynamicContextProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
