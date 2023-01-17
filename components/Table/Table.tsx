import { useState, FC } from 'react';
import Row from './Row';
import HeaderTable from './HeaderTable';
import { Toast } from 'components/Layout';
import { SuccessContext, SiteMintingContext } from 'contexts';
import { Sources } from 'types';
import { useFetchTokens } from 'hooks';

const Table: FC = () => {
  const [message, setMessage] = useState('');
  const [mint, setMint] = useState<string | undefined>(undefined);
  const { mongoTokens, tokens, tokensAmount, walletTokens, r, refresh } =
    useFetchTokens();

  return (
    <div className="d-flex flex-column flex-justify-center flex-items-center mt-4">
      {' '}
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
          {walletTokens.map((token, i) => (
            <Row
              source={Sources.Wallet}
              key={i}
              tokenName={token.token}
              tokenOwner={token.owner}
            />
          ))}
          {mongoTokens.map((token, i) => (
            <Row
              key={i}
              tokenName={token.token}
              tokenOwner={token.owner}
              source={Sources.Db}
            />
          ))}
          <Toast />
        </SiteMintingContext.Provider>
      </SuccessContext.Provider>
    </div>
  );
};

export default Table;
