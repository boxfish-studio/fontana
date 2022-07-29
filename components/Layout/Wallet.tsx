import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FC } from "react";

const Wallet: FC = () => {
  return (
    <div
      className="d-flex "
      style={{
        transform: "scale(0.7)",
      }}
    >
      <WalletMultiButton />
    </div>
  );
};

export default Wallet;
