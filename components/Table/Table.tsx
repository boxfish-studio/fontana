import { Box } from "@primer/react";
import { useState } from "react";
import Row from "./Row";
import HeaderTable from "./HeaderTable";
import { Toast } from "components/Layout";
import { SuccessContext, SiteMintingContext } from "contexts";
import { Sources } from "types";
import { useFetchTokens } from "hooks";

const Table: React.FC = () => {
  const [message, setMessage] = useState("");
  const [mint, setMint] = useState<string | undefined>(undefined);
  const { mongoTokens, tokens, tokensAmount, walletTokens, r, refresh } =
    useFetchTokens();

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
          <HeaderTable tokensAmount={tokensAmount} />
          {tokens.map((token, i) => {
            if (!token) return;
            return (
              <Row
                source={Sources.Config}
                key={i}
                tokenTicker={token.ticker}
                tokenKeypair={token.keypair}
                tokenName={token.token}
                tokenOwner={token.owner}
              />
            );
          })}
          {walletTokens.map((token, i) => {
            return (
              <Row
                source={Sources.Wallet}
                key={i}
                tokenName={token.token}
                tokenOwner={token.owner}
              />
            );
          })}
          {mongoTokens.map((token, i) => {
            return (
              <Row
                key={i}
                tokenName={token.token}
                tokenOwner={token.owner}
                source={Sources.Db}
              />
            );
          })}
          <Toast />
        </SiteMintingContext.Provider>
      </SuccessContext.Provider>
    </Box>
  );
};

export default Table;
