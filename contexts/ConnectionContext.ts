import { createContext, useContext } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Connection } from "@solana/web3.js";
export type Network = keyof typeof WalletAdapterNetwork;
type TConnection = {
  connection: Connection | null;
  network: Network;
  url: string | null;
  setConnection: (connection: Connection) => void;
  setNetwork: (network: Network) => void;
  setUrl: (url: string) => void;
};

export const ConnectionContext = createContext<TConnection>({
  connection: null,
  network: "Devnet",
  url: null,
  setConnection: () => {},
  setNetwork: () => {},
  setUrl: () => {},
});

export const useConnection = () => useContext(ConnectionContext);
