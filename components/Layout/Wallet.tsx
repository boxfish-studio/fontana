import type { FC } from 'react';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from 'components/WalletWrapper';

const Wallet: FC = () => {
  const { publicKey } = useWallet();
  return (
    <div
      className="d-flex "
      style={{
        transform: 'scale(0.7)',
      }}
    >
      <WalletMultiButton className="solana-wallet-adapter-button">
        {!publicKey
          ? 'Connect Wallet'
          : publicKey?.toBase58().slice(0, 4) +
            '..' +
            publicKey?.toBase58().slice(-4)}{' '}
      </WalletMultiButton>
    </div>
  );
};

export default Wallet;
