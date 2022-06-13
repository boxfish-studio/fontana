// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { rpcMethods } from "lib/spl";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
type Data = {
  name: string;
  r: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const tx = req.body.tx;
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!);
  const signer = process.env.NEXT_PUBLIC_SIGNER! as unknown as number[];
  const keypair = Keypair.fromSecretKey(new Uint8Array(signer));
  const t = new rpcMethods(connection).sendTx(tx, keypair).then((r) => {
    res.status(200).json({ name: "John Doe", r });
  });
}
