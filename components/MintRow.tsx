import { useConnection } from "@solana/wallet-adapter-react";
import { rpcMethods } from "lib/spl";
const owner = "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu";

const MintRow: React.FC<{
  mint: string;
  amount: number;
}> = ({ mint, amount }) => {
  const owner = "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu";
  const { connection } = useConnection();

  async function mintTokens() {
    const ix = new rpcMethods(connection).mintTokensInstruction(owner, mint, 4);
    const tx = await rpcMethods.createTx(ix);
  }

  return (
    <div>
      {mint}-{amount}
      <button onClick={mintTokens}>Mint more</button>
      <button>Transfer</button>
    </div>
  );
};

export default MintRow;
