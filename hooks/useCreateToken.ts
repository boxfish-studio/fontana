
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { RpcMethods } from "lib/spl";
import { useRefresh, useSuccess, useHasMongoUri } from "contexts";
import { useState } from "react";
import { createMint } from "lib/create-token";

export default function useCreateToken() {
  const { r, refresh } = useRefresh();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { setMessage, setMint } = useSuccess();
  const [minting, setMinting] = useState(false);
  const { hasMongoUri } = useHasMongoUri();
  function triggerRefresh() {
    refresh(!r);
  }
  async function createToken() {
    if (!publicKey && hasMongoUri) {
      try {
        setMinting(true);
        const tokenData = await createMint();
        if (!tokenData) return;
        await fetch("api/mongo-new-token", {
          method: "POST",
          body: JSON.stringify(tokenData),
        });
        setMinting(false);
        setMessage(
          `Success! New mint ${tokenData.token.slice(0, 12)}... created.`
        );
        setMint(tokenData.token);

        triggerRefresh();
        return;
      } catch (e) {
        setMinting(false);
        console.error(e);
        return;
      }
    }
    try {
      if (!publicKey) return;
      setMinting(true);
      const mint = Keypair.generate();

      const rpc = new RpcMethods(connection);

      const ata = await rpc.getAssociatedTokenAccount(
        mint.publicKey.toBase58(),
        publicKey.toBase58()
      );

      let tx = new Transaction()
        .add(
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: mint.publicKey,
            space: MINT_SIZE,
            lamports: await getMinimumBalanceForRentExemptMint(connection),
            programId: TOKEN_PROGRAM_ID,
          })
        )
        .add(
          createInitializeMintInstruction(
            mint.publicKey,
            0,
            publicKey,
            publicKey
          )
        )
        .add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            ata,
            publicKey,
            mint.publicKey
          )
        );
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = publicKey;
      tx.sign(mint);
      const signature = await sendTransaction(tx, connection);
      await rpc.confirmTransaction(signature);
      triggerRefresh();
      setMessage(
        `Success! New mint ${mint.publicKey
          .toBase58()
          .slice(0, 12)}... created.`
      );
      setMint(mint.publicKey.toBase58());
    } catch (e) {
      console.error(e);
    }
    setMinting(false);
  }

  return {
    createToken,
    minting,
    triggerRefresh
  }
}
