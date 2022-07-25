import { Box } from "@primer/react";
import { useState, useMemo, createContext, useContext } from "react";
import Row from "./Row";
import HeaderTable from "./HeaderTable";
import fontanaConfig from "../../fontana.config";

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
  const [r, refresh] = useState(false);
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
        <HeaderTable tokensAmount={tokens.length} />
        {tokens.map((token, i) => {
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
