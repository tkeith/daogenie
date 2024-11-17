import { createContext, useContext, ReactNode } from "react";
import { WalletClient } from "viem";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { EthereumWallet } from "@dynamic-labs/ethereum-core";

interface GenieContextType {
  ethereumWallet: EthereumWallet;
  walletClient: WalletClient;
  chainId: number;
  contractAddress: `0x${string}`;
  myAddress: `0x${string}`;
}

const GenieContext = createContext<GenieContextType | null>(null);

export function GenieProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: GenieContextType | null;
}) {
  return (
    <GenieContext.Provider value={value}>{children}</GenieContext.Provider>
  );
}

export function useOptionalGenieContext() {
  const context = useContext(GenieContext);
  return context;
}

export function useGenieContext() {
  const context = useContext(GenieContext);
  if (!context) {
    throw new Error("useGenieContext must be used within a GenieProvider");
  }
  return context;
}
