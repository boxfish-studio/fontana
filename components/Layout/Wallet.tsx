import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FC } from "react";
import styles from "styles/Wallet.module.css";

const Wallet: FC = () => {
  return (
    <div className={styles.wallet}>
      <WalletMultiButton />
    </div>
  );
};

export default Wallet;
