import { Box } from "@primer/react";
import { useState, useMemo, createContext, useContext, useEffect } from "react";
import Row from "./Row";
import HeaderTable from "./HeaderTable";
import fontanaConfig from "../../fontana.config";
import { RpcMethods } from "lib/spl";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Toast } from "components/Layout";

type Refresh = {
  r: boolean;
  refresh: (r: boolean) => void;
};

const SiteMintingContext = createContext<Refresh>({
  r: false,
  refresh: () => {},
});

export const useRefresh = () => useContext(SiteMintingContext);

type Success = {
  message: string;
  setMessage: (message: string) => void;
  mint: string | undefined;
  setMint: (mint: string) => void;
};

const SuccessContext = createContext<Success>({
  message: "",
  setMessage: (message: string) => {
    message = message;
  },
  mint: undefined,
  setMint: (mint: string) => (mint = mint),
});

export const useSuccess = () => useContext(SuccessContext);

const Table: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [walletTokens, setWalletTokens] = useState<any[]>([]);
  const [r, refresh] = useState(false);
  const [message, setMessage] = useState("");
  const [mint, setMint] = useState<string | undefined>(undefined);
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
      if (!publicKey) return setWalletTokens([]);
      const rpc = new RpcMethods(connection);
      const _tokens = (
        await rpc.queryTokenByAuthority(publicKey?.toBase58())
      ).map((token) => {
        return {
          keypair: undefined,
          token: token.tokenMint,
          owner: publicKey.toBase58(),
          ticker: undefined,
        };
      });
      setWalletTokens(_tokens);
    })();
  }, [publicKey, r]);

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
      <SuccessContext.Provider value={{ message, setMessage, mint, setMint }}>
        <SiteMintingContext.Provider value={{ r, refresh }}>
          <HeaderTable tokensAmount={tokens.length + walletTokens.length} />
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
        {walletTokens.map((token, i) => {
          return (
            <Row
              key={i}
              tokenTicker={token.ticker}
              tokenKeypair={token.keypair}
              tokenName={token.token}
              tokenOwner={token.owner}
              walletAuthority
            />
          );
        })}
        <Toast />
      </SuccessContext.Provider>
    </Box>
  );
};

export default Table;
