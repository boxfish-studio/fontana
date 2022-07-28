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
  console.log("$req", req.body);
  const {
    owner,
    token,
    amount,
    keypair: _keypair,
    network,
  } = JSON.parse(req.body);
  (async () => {
    try {
      const endpoint =
        network === "Mainnet"
          ? process.env.NEXT_PUBLIC_RPC_API_MAINNET
          : process.env.NEXT_PUBLIC_RPC_API_DEVNET;
      const connection = new Connection(endpoint!);
      const rpc = new RpcMethods(connection);
      const ix = rpc.mintTokensInstruction(owner, token, amount);

      const tx = RpcMethods.createTx(await ix);
      console.log("tx", tx);
      console.log("_keypair", _keypair);
      const signer = process.env[`NEXT_PUBLIC_${_keypair}`];

      if (!signer) throw new Error("No keypair found on env");

      const signerParsed = signer
        .slice(1, -1)
        .split(",")
        .map((x) => parseInt(x));

      const keypair = Keypair.fromSecretKey(new Uint8Array(signerParsed));
      console.log("keypair", keypair.publicKey.toBase58());

      const signature = await rpc.sendTx(tx, keypair);

      await rpc.confirmTransaction(signature);

      res.status(200).json({ tx: signature });
    } catch (e) {
      console.log("e", e);
      res.status(500).json({ err: (e as Error).message });
    }
  })();
}
