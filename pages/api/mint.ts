// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RpcMethods } from "lib/spl";
import { Connection, Keypair } from "@solana/web3.js";
type Data = {
  tx: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("$req", req.body);
  const { owner, token, amount, keypair:_keypair } = JSON.parse(req.body);
  (async () => {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!);
    const rpc = new RpcMethods(connection);
    const ix = rpc.mintTokensInstruction(owner, token, amount);

    const tx = RpcMethods.createTx(await ix);
    console.log("tx", tx);
    console.log("_keypair", _keypair);
    const signer = process.env[`NEXT_PUBLIC_${_keypair}`] as string;

    const signerParsed = signer
      .slice(1, -1)
      .split(",")
      .map((x) => parseInt(x));

    const keypair = Keypair.fromSecretKey(new Uint8Array(signerParsed));
    console.log("keypair", keypair.publicKey.toBase58());

    const signature = await rpc.sendTx(tx, keypair);

    await rpc.confirmTransaction(signature);

    res.status(200).json({ tx: signature });
  })();
}
