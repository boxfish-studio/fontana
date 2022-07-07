import { Header, Text, Button, Box, StyledOcticon } from "@primer/react";
import { CheckIcon, SyncIcon } from "@primer/octicons-react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { RpcMethods } from "lib/spl";
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  createContext,
  useContext,
} from "react";
import styles from "styles/MintRow.module.css";
import Row from "./Row";
import HeaderTable from "./HeaderTable";
import fontanaConfig from "../../fontana.config";

type Refresh = {
  r: boolean;
  refresh: (r:boolean) => void;
};

const SiteMintingContext = createContext<Refresh>({
  r: false,
  refresh: () => {},
});

export const useRefresh = () => useContext(SiteMintingContext);

const Table: React.FC = () => {
  const [r, refresh] = useState(false)
  const tokens = useMemo(() => {
    return fontanaConfig.map((token) => {
      return {
        keypair: token.keypair,
        token: token.token,
        owner: token.owner,
        ticker: token.ticker,
      };
    });
  }, []);

  return (
    <Box
      display="flex"
      margin={0}
      marginTop={3}
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "0",
      }}
    >
      {" "}
      <SiteMintingContext.Provider value={{ r, refresh }}>
        <HeaderTable />
        {tokens.map((token) => {
          return (
            <Row
              key={token.token}
              tokenTicker={token.ticker}
              tokenKeypair={token.keypair}
              tokenName={token.token}
              tokenOwner={token.owner}
            />
          );
        })}
      </SiteMintingContext.Provider>
    </Box>
  );
};

export default Table;
