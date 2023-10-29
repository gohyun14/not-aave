import { type AppType } from "next/dist/shared/lib/utils";
import { Provider as JotaiProvider } from "jotai";
import { atom } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  WagmiConfig,
  createClient,
  configureChains,
  sepolia,
} from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import "@/styles/globals.css";

const { chains, provider } = configureChains(
  [sepolia],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_AIP_KEY as string })]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: "wagmi",
    //   },
    // }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
});

// Create a client
// const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      {/* <QueryClientProvider client={queryClient}> */}
      <JotaiProvider>
        <Component {...pageProps} />
      </JotaiProvider>
      {/* </QueryClientProvider> */}
    </WagmiConfig>
  );
};

export default MyApp;
