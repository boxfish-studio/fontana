import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useMemo } from "react";
import {
  WalletProvider,
} from "@solana/wallet-adapter-react";
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
import {  Connection } from "@solana/web3.js";
import { ThemeProvider, BaseStyles, theme } from "@primer/react";
import deepmerge from "deepmerge";
import { ConnectionContext } from "contexts";
import type { Network } from "contexts";

const customTheme = deepmerge(theme, {
  fonts: {
    mono: "MonoLisa, monospace",
  },
  colors: {
    text: "#000",
    background: "#fff",
    primary: "gray",
    navbarBackground: "#24292E",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [connection, setConnection] = React.useState<Connection | null>(null);
  const [network, setNetwork] = React.useState<Network>("Devnet");
  const [url, setUrl] = React.useState<string | null>(null);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new SolletWalletAdapter(),
      new SolletExtensionWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionContext.Provider
      value={{
        connection,
        setConnection,
        network,
        setNetwork,
        url,
        setUrl,
      }}
    >
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          {/* @ts-ignore */}
          <ThemeProvider theme={customTheme} colorMode="auto">
            <BaseStyles>
              <Component {...pageProps} />
            </BaseStyles>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionContext.Provider>
  );
}

export default MyApp;
