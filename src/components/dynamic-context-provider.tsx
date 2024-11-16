"use client";

import { env } from "@/env";
import { NETWORKS } from "@/lib/blockchain/networks";
import { getRpcUrlByChainId } from "@/lib/utils";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { mergeNetworks, useDynamicContext } from "@dynamic-labs/sdk-react-core";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { JsonRpcProvider } from "ethers";
import { createConfig, http, WagmiContext, WagmiProvider } from "wagmi";

export function CustomizedDynamicContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks: (networks) => mergeNetworks(NETWORKS, networks),
        },
      }}
    >
      <WagmiSetup>{children}</WagmiSetup>
    </DynamicContextProvider>
  );
}

function WagmiSetup({ children }: { children: React.ReactNode }) {
  const dynamicContext = useDynamicContext();

  if (!dynamicContext.primaryWallet) {
    return null;
  }

  const chainId = dynamicContext.network;

  // assert is int
  if (typeof chainId !== "number") {
    return "waiting for network";
  }

  console.log("chainId", chainId);

  const wagmiConfig = createConfig({
    chains: [
      {
        id: chainId,
        name: "Chain",
        nativeCurrency: {
          decimals: 18,
          name: "Ether",
          symbol: "ETH",
        },
        rpcUrls: {
          public: {
            http: [getRpcUrlByChainId(chainId)],
          },
          default: {
            http: [getRpcUrlByChainId(chainId)],
          },
        },
      },
    ],
    transports: {
      [chainId]: http(),
    },
  });

  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}
