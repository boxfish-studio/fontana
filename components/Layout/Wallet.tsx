import type { FC } from 'react';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Wallet: FC = () => (
  <div
    className="d-flex "
    style={{
      transform: 'scale(0.7)',
    }}
  >
    <WalletMultiButton />
  </div>
);

export default Wallet;
