import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { rpcMethods } from "lib/spl";
import { useEffect, useState } from "react";
import styles from "styles/MintRow.module.css";

const owner = "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu";

const MintRow: React.FC<{
  token: string;
  badge: string;
}> = ({ token, badge }) => {
  const { connection } = useConnection();
  const { connected } = useWallet();
  const [mintedAmount, setMintedAmount] = useState<null | number>(null);
  const [walletAmount, setWalletAmount] = useState<null | number>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintAmount, setMintAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);

  async function getTokenBalance() {
    const amount = await new rpcMethods(connection).getTokenBalance(
      owner,
      token
    );
    setMintedAmount(amount);
    if (!connected) return;
    const walletAmount = await new rpcMethods(connection).getTokenBalance(
      owner,
      token
    );
    setWalletAmount(walletAmount);
  }

  useEffect(() => {
    getTokenBalance();
  }, [connected]);

  async function mintTokens() {
    setIsMinting(true);
    if (mintAmount === 0) {
      setIsMinting(false);
      return;
    }
    const res = await fetch("api/mint/", {
      method: "POST",
      body: JSON.stringify({
        owner,
        token,
        amount: mintAmount,
      }),
    });
    console.log("res", await res.json());
    setIsMinting(false);

    getTokenBalance();
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span> Badge: {badge}</span>
        <span> Mint address: {token}</span>
        <span> Minted amount: {mintedAmount}</span>
        <span> My amount: {walletAmount}</span>
      </div>
      <span className={styles.isMinting}>
        {isMinting && <div>Minting...</div>}
      </span>
      <div className={styles.buttons}>
        <input
          value={mintAmount}
          onChange={(e) => setMintAmount(parseInt(e.target.value))}
        />
        <button onClick={mintTokens}>Mint more</button>
        <input
          value={transferAmount}
          onChange={(e) => setTransferAmount(parseInt(e.target.value))}
        />

        <button>Transfer</button>
      </div>
    </div>
  );
};

export default MintRow;
