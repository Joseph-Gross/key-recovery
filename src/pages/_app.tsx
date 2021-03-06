/* eslint-disable react/jsx-props-no-spreading */
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Head from "next/head";

import Layout from "../components/Layout";
import "../styles/globals.css";

import { ChakraProvider, localStorageManager } from "@chakra-ui/react";

import customTheme from "../styles/customTheme";

import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
  useProvider,
} from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePrivySession } from "../components/PrivySession";

declare global {
  interface Window {
    // @ts-ignore
    ethereum: any;
  }
}

const alchemyId = process.env.ALCHEMY_ID;

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ alchemyId }),
  publicProvider(),
]);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const privySession = usePrivySession();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    function onSuccess() {
      setInitialized(true);
      console.log("Privy Session Initialized");
    }

    function onFailure(error: Error) {
      setInitialized(true);
      console.log(`Error initializing Privy Session: ${error}`);
    }

    privySession.initialize().then(onSuccess, onFailure);
  }, [privySession]);

  if (!initialized) {
    return null;
  }

  return (
    <WagmiConfig client={client}>
      <ChakraProvider
        colorModeManager={localStorageManager}
        theme={customTheme}
      >
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
          <title>Keykovery</title>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </WagmiConfig>
  );
};

export default MyApp;
