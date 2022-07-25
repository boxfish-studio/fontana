// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RpcMethods } from "lib/spl";
import { Connection, Keypair } from "@solana/web3.js";
type Data = {
  tx?: string;
  err?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("req", req.body);
  const {
    owner,
    token,
    amount,
    recipient,
    keypair: _keypair,
  } = JSON.parse(req.body);
  (async () => {
    try{

    
    const signer = process.env[`NEXT_PUBLIC_${_keypair}`];
    if(!signer) throw new Error ("No keypair found on env");

    const signerParsed = signer
      .slice(1, -1)
      .split(",")
      .map((x) => parseInt(x));

    const keypair = Keypair.fromSecretKey(new Uint8Array(signerParsed));
    console.log("keypair", keypair.publicKey.toBase58());

    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!);
    const rpc = new RpcMethods(connection);
    const ix = rpc.transferInstruction(
      owner,
      token,
      amount,
      recipient,
      keypair
    );

    const tx = RpcMethods.createTx(await ix);
    console.log("tx", tx);

    const signature = await rpc.sendTx(tx, keypair);

    await rpc.confirmTransaction(signature);

    res.status(200).json({ tx: signature });
    }
    catch (e) {
      console.log("e", e);
      res.status(500).json({ err: (e as Error).message });
    }
  })();
}
