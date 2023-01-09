/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { RpcMethods } from 'lib/spl';
import { Database } from 'db/lib';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';

type Data = {
  tx?: string;
  err?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    owner,
    token,
    amount,
    keypair: _keypair,
    network,
    mongo,
  } = JSON.parse(req.body);
  (async () => {
    try {
      const endpoint =
        network === 'Mainnet'
          ? process.env.NEXT_PUBLIC_RPC_API_MAINNET ||
            clusterApiUrl('mainnet-beta')
          : process.env.NEXT_PUBLIC_RPC_API_DEVNET || clusterApiUrl('devnet');
      const connection = new Connection(endpoint);
      const rpc = new RpcMethods(connection);
      const ix = rpc.mintTokensInstruction(owner, token, amount);

      const tx = RpcMethods.createTx(await ix);
      const signer = mongo
        ? await new Database().queryKeypair(token as string)
        : process.env[`NEXT_PUBLIC_${_keypair}`];

      if (!signer) throw new Error('No keypair found on env');

      const signerParsed = signer
        .slice(1, -1)
        .split(',')
        .map((x) => parseInt(x));

      const keypair = Keypair.fromSecretKey(new Uint8Array(signerParsed));

      const signature = await rpc.sendTx(tx, keypair);

      await rpc.confirmTransaction(signature);

      return res.status(200).json({ tx: signature });
    } catch (e) {
      console.error('e', e);
      return res.status(500).json({ err: (e as Error).message });
    }
  })();
}
