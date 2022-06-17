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
  const [mintAmount, setMintAmount] = useState(1);
  const [transferAmount, setTransferAmount] = useState(1);

  const getTokenBalance = useCallback(async () => {
    const rpc = new RpcMethods(connection);
    const amount = await rpc.getTokenBalance(owner, token);
    setMintedAmount(amount);
    if (!publicKey) return;
    const walletAmount = await rpc.getTokenBalance(publicKey.toBase58(), token);
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
    try {
      const res = await fetch("api/mint/", {
        method: "POST",
        body: JSON.stringify({
          owner,
          token,
          amount: mintAmount,
        }),
      });
      console.log("res", await res.json());
    } catch (err) {
      console.error(err);
    }
    setAction(null);
    getTokenBalance();
  }

  async function transferTokens() {
    setAction("Transferring...");
    if (transferAmount === 0 || !publicKey) {
      setAction(null);
      return;
    }
    try {
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
    } catch (err) {
      console.error(err);
    }
    setAction(null);
    getTokenBalance();
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span> Badge: {badge}</span>
        <div>
          <span> Mint address: {token}</span>
          <hr />
        </div>
        <span> Minted amount: {mintedAmount}</span>
        <span> My amount: {walletAmount}</span>
      </div>
      <span className={styles.isMinting}>{action && <div>{action}</div>}</span>
      <div className={styles.buttons}>
        <span>
          <input
            defaultValue={1}
            onChange={(e) => setMintAmount(parseInt(e.target.value))}
          />

          <button onClick={mintTokens}>Mint</button>
        </span>
        <span>
          <input
            defaultValue={1}
            onChange={(e) => setTransferAmount(parseInt(e.target.value))}
          />

          <button onClick={transferTokens}>Transfer</button>
        </span>
      </div>
    </div>
  );
};

export default MintRow;
