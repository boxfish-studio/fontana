import { Box } from "@primer/react";
import { useState, useMemo, createContext, useContext, useEffect } from "react";
import Row from "./Row";
import HeaderTable from "./HeaderTable";
import fontanaConfig from "../../fontana.config";
import { RpcMethods } from "lib/spl";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

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
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [tokens2, setTokens2] = useState<any[]>([]);
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
  useEffect(() => {
    (async () => {
      if (!publicKey) return;
      const rpc = new RpcMethods(connection);
      const x = (
        await rpc.queryTokenByAuthority(
          publicKey?.toBase58()
        )
      ).map((token) => {
        return {
          keypair: token.tokenMint,
          token: token.tokenMint,
          owner: token.tokenMint,
          ticker: token.tokenMint,
        };
      });
      setTokens2(x);
    })();
  }, [publicKey]);

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
      <SiteMintingContext.Provider value={{ r, refresh }}>
        <HeaderTable tokensAmount={tokens2.length} />
        {tokens2.map((token, i) => {
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
