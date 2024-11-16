import { env } from "@/env";
import { NETWORKS } from "@/lib/blockchain/networks";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { mergeNetworks } from "@dynamic-labs/sdk-react-core";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";

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
      {children}
    </DynamicContextProvider>
  );
}
