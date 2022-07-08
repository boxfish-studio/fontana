import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { Wallet } from "components/Layout";
import {ThemeProvider,BaseStyles, theme} from '@primer/react'
import deepmerge from "deepmerge";
const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST;


const customTheme = deepmerge(theme, {
  fonts: {
    mono: 'MonoLisa, monospace'
  },
  colors: {
    text: {
      default: '#000'
    }
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => rpc || clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <Wallet />
          {/* @ts-ignore */}
          <ThemeProvider theme={customTheme} colorMode="auto">
            <BaseStyles>
              <Component {...pageProps} />
            </BaseStyles>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
