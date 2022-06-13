const owner = "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu";

const MintRow: React.FC<{
  mint: string;
  amount: number;
}> = ({ mint, amount }) => {
  async function mintTokens() {
    const res = await fetch("api/mint/", {
      method: "POST",
      body: JSON.stringify({
        owner,
        mint,
        amount: 4,
      }),
    });
    console.log("res", await res.json());
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
