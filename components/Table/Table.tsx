import { Box } from "@primer/react";
import { useState, useMemo, createContext, useContext } from "react";
import Row from "./Row";
import HeaderTable from "./HeaderTable";
import fontanaConfig from "../../fontana.config";
import { useConnection } from "contexts";

type Refresh = {
  r: boolean;
  refresh: (r: boolean) => void;
};

const SiteMintingContext = createContext<Refresh>({
  r: false,
  refresh: () => {},
});

export const useRefresh = () => useContext(SiteMintingContext);

const Table: React.FC = () => {
  const { network } = useConnection();
  const [r, refresh] = useState(false);
  const tokens = useMemo(() => {
    return fontanaConfig.reduce((acc, token) => {
      if (token.network === network) {
        return [...acc, token];
      }
      return [...acc];
    }, [] as Partial<typeof fontanaConfig>);
  }, [network]);

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
        <HeaderTable tokensAmount={tokens.length} />
        {tokens.map((token, i) => {
          if (!token) return;
          return (
            <Row
              key={i}
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
