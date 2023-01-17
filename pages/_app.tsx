/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import React, { ReactNode, useMemo, useState } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Connection } from '@solana/web3.js';
import {
  ThemeProvider,
  BaseStyles,
  theme,
  ThemeProviderProps,
} from '@primer/react';
import deepmerge from 'deepmerge';
import { ConnectionContext } from 'contexts';
import type { Network } from 'contexts';

const customTheme = deepmerge(theme, {
  fonts: {
    mono: 'MonoLisa, monospace',
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: 'gray',
    navbarBackground: '#24292E',
  },
});

const CustomThemeProvider: React.FC<
  ThemeProviderProps & { children: ReactNode }
> = ({ children, ...props }) => (
  <ThemeProvider {...props}>{children}</ThemeProvider>
);

function MyApp({ Component, pageProps }: AppProps) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [url, setUrl] = useState<string | null>(null);

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
          <CustomThemeProvider theme={customTheme} colorMode="day">
            <BaseStyles>
              <Component {...pageProps} />
            </BaseStyles>
          </CustomThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionContext.Provider>
  );
}

export default MyApp;
