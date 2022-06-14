import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { RpcMethods } from "lib/spl";
import { useCallback, useEffect, useState } from "react";
import styles from "styles/MintRow.module.css";

const owner = "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu";

const MintRow: React.FC<{
  token: string;
  badge: string;
}> = ({ token, badge }) => {
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const [mintedAmount, setMintedAmount] = useState<null | number>(null);
  const [walletAmount, setWalletAmount] = useState<null | number>(null);
  const [action, setAction] = useState<null | string>(null);
  const [mintAmount, setMintAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);

  const getTokenBalance = useCallback(async () => {
    const amount = await new RpcMethods(connection).getTokenBalance(
      owner,
      token
    );
    setMintedAmount(amount);
    if (!publicKey) return;
    const walletAmount = await new RpcMethods(connection).getTokenBalance(
      publicKey.toBase58(),
      token
    );
    setWalletAmount(walletAmount);
  }, [connection, publicKey, token]);

  useEffect(() => {
    getTokenBalance();
  }, [connected, getTokenBalance]);

  async function mintTokens() {
    setAction("Minting...");
    if (mintAmount === 0) {
      setAction(null);
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
    setAction(null);

    getTokenBalance();
  }

  async function transferTokens() {
    setAction("Transferring...");
    if (transferAmount === 0 || !publicKey) {
      setAction(null);
      return;
    }
    const res = await fetch("api/transfer/", {
      method: "POST",
      body: JSON.stringify({
        owner,
        token,
        amount: transferAmount,
        recipient: publicKey.toBase58(),
      }),
    });
    console.log("res", await res.json());
    setAction(null);

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
      <span className={styles.isMinting}>{action && <div>{action}</div>}</span>
      <div className={styles.buttons}>
        <span>
          <input
            value={mintAmount}
            onChange={(e) => setMintAmount(parseInt(e.target.value))}
          />

          <button onClick={mintTokens}>Mint more</button>
        </span>
        <span>
          <input
            value={transferAmount}
            onChange={(e) => setTransferAmount(parseInt(e.target.value))}
          />

          <button onClick={transferTokens}>Transfer</button>
        </span>
      </div>
    </div>
  );
};

export default MintRow;
