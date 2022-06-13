// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { rpcMethods } from "lib/spl";
import { Connection, Keypair } from "@solana/web3.js";
type Data = {
  tx: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("req", req.body);
  const { owner, token, amount } = JSON.parse(req.body);
  (async () => {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!);

    const ix = new rpcMethods(connection).mintTokensInstruction(
      owner,
      token,
      amount
    );

    const tx = rpcMethods.createTx(await ix);

    const signer = process.env.NEXT_PUBLIC_SIGNER! as string;

    const signerParsed = signer
      .slice(1, -1)
      .split(",")
      .map((x) => parseInt(x));

    const keypair = Keypair.fromSecretKey(new Uint8Array(signerParsed));

    const signature = await new rpcMethods(connection).sendTx(tx, keypair);

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature,
    });

    res.status(200).json({ tx: signature });
  })();
}
