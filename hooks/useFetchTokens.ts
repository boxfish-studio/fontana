import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { RpcMethods } from "lib/spl";
import { useHasMongoUri } from "contexts";
import { useEffect, useMemo, useState } from "react";
import fontanaConfig from "fontana.config";

interface Token {
  token: string;
  owner: string;
}

export default function useFetchTokens() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [walletTokens, setWalletTokens] = useState<Token[]>([]);
  const [mongoTokens, setMongoTokens] = useState<Token[]>([]);
  const [r, refresh] = useState(false);
  const { hasMongoUri } = useHasMongoUri();

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
    if (!hasMongoUri || publicKey) return setMongoTokens([]);
    (async () => {
      const res = await fetch("api/mongo-get", {
        method: "GET",
      });
      const { queryResults } = (await res.json()) as {
        queryResults: Token[];
      };
      setMongoTokens(queryResults);
    })();
  }, [hasMongoUri, publicKey, r]);

  useEffect(() => {
    if (!publicKey) return setWalletTokens([]);
    (async () => {
      const rpc = new RpcMethods(connection);
      const queryResults = (
        await rpc.queryTokenByAuthority(publicKey.toBase58())
      ).map((token) => {
        return {
          token: token.tokenMint,
          owner: publicKey.toBase58(),
        };
      });
      setWalletTokens(queryResults);
    })();
  }, [connection, publicKey, r]);

  const tokensAmount = useMemo(
    () => tokens.length + walletTokens.length + mongoTokens.length,
    [tokens, walletTokens, mongoTokens]
  );

  return {
    tokens,
    tokensAmount,
    mongoTokens,
    walletTokens,
    r,
    refresh,
  };
}
