import { useConnection } from "@solana/wallet-adapter-react";
import { rpcMethods } from "lib/spl";
import { useEffect, useState } from "react";

const owner = "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu";

const MintRow: React.FC<{
  token: string;
}> = ({ token }) => {
  const [amount, setAmount] = useState(10);
  const { connection } = useConnection();
  const [isMinting, setIsMinting] = useState(false);
  async function getTokenBalance() {
    const amount = await new rpcMethods(connection).getTokenBalance(
      owner,
      token
    );

    setAmount(amount);
  }

  useEffect(() => {
    getTokenBalance();
  }, []);

  async function mintTokens() {
      setIsMinting(true)
    const res = await fetch("api/mint/", {
      method: "POST",
      body: JSON.stringify({
        owner,
        token,
        amount: 4,
      }),
    });
    console.log("res", await res.json());
    setIsMinting(false)

    getTokenBalance();
  }

  return (
    <div>
      {token}-{amount}
      {isMinting && <div>Minting...</div>}
      <button onClick={mintTokens}>Mint more</button>
      <button>Transfer</button>
    </div>
  );
};

export default MintRow;
