"use client";

import { env } from "@/env";
import { getGenieAddress } from "@/lib/blockchain/address";
import { GenieProvider } from "@/lib/blockchain/genie-provider";
import { NETWORKS } from "@/lib/blockchain/networks";
import { getRpcUrlByChainId } from "@/lib/utils";
import {
  EthereumWalletConnectors,
  isEthereumWallet,
} from "@dynamic-labs/ethereum";
import { mergeNetworks, useDynamicContext } from "@dynamic-labs/sdk-react-core";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { JsonRpcProvider } from "ethers";
import { useEffect, useState } from "react";
import { createConfig, http, WagmiContext, WagmiProvider } from "wagmi";
import { WalletClient } from "viem";

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
          // evmNetworks: (networks) => mergeNetworks(NETWORKS, networks),
          evmNetworks: (networks) => NETWORKS,
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}

export function WagmiSetup({ children }: { children: React.ReactNode }) {
  const dynamicContext = useDynamicContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-unsafe-assignment
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const ethereumWallet = dynamicContext.primaryWallet;

  useEffect(() => {
    if (!ethereumWallet || !isEthereumWallet(ethereumWallet)) {
      return;
    }
    void ethereumWallet.getWalletClient().then((client) => {
      setWalletClient(client);
    });
  }, [ethereumWallet]);

  if (!ethereumWallet) {
    return "Loading...";
  }

  if (!isEthereumWallet(ethereumWallet)) {
    return "not an ethereum wallet";
  }

  const chainId = dynamicContext.network;

  // assert is int
  if (typeof chainId !== "number") {
    return "waiting for network";
  }

  console.log("chainId", chainId);

  if (!walletClient) {
    return "waiting for wallet client";
  }

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

  const contractAddress = getGenieAddress(chainId) as `0x${string}`;

  const myAddress = ethereumWallet.address;

  return (
    <GenieProvider
      value={{
        ethereumWallet,
        walletClient,
        chainId,
        contractAddress,
        myAddress: myAddress as `0x${string}`,
      }}
    >
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </GenieProvider>
  );
}
