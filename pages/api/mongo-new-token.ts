import { NextApiRequest, NextApiResponse } from "next";

import { dbConnect } from "db/lib";
import { Token } from "db/model";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { RpcMethods } from "lib/spl";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

async function createToken() {
  try {
    const mint = Keypair.generate();
    const owner = Keypair.generate();
    const publicKey = owner.publicKey;
    const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPCs_HOST;
    const endpoint = rpcEndpoint || clusterApiUrl("devnet");
    console.log("endpoint", endpoint);
    const connection = new Connection(endpoint);
    const rpc = new RpcMethods(connection);

    let txhash = await connection.requestAirdrop(owner.publicKey, 1e8);
    await rpc.confirmTransaction(txhash);
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
        createInitializeMintInstruction(mint.publicKey, 0, publicKey, publicKey)
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
    const signature = await connection.sendTransaction(tx, [mint, owner]);
    await rpc.confirmTransaction(signature);
    return {
      token: mint.publicKey.toBase58(),
      owner: owner.publicKey.toBase58(),
      keypair: `[${owner.secretKey.toString()}]`,
    };
  } catch (e) {
    console.error(e);
  }
}
interface Res {
  token?: string;
  owner?: string;
  err?: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>
) {
  try {
    await dbConnect();
    const token = await createToken();
    await Token.create(token);
    console.log("token created",token);
    res.status(200).json({ token: token?.token, owner: token?.owner });
  } catch (e) {
    console.error(e);
    res.status(500).json({ err: (e as Error).message });
  }
}
