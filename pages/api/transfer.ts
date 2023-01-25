/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { NextApiRequest, NextApiResponse } from 'next';

import { RpcMethods } from 'lib/spl';
import { Connection, Keypair } from '@solana/web3.js';
import { Database } from 'db/lib';

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
    recipient,
    network,
    keypair: _keypair,
    mongo,
  } = JSON.parse(req.body);
  void (async () => {
    try {
      const signer = mongo
        ? await new Database().queryKeypair(token as string)
        : process.env[`NEXT_PUBLIC_${_keypair}`];

      if (!signer) throw new Error('No keypair found on env');

      const signerParsed = signer
        .slice(1, -1)
        .split(',')
        .map((x) => parseInt(x));

      const keypair = Keypair.fromSecretKey(new Uint8Array(signerParsed));

      const endpoint =
        network === 'Mainnet'
          ? process.env.NEXT_PUBLIC_RPC_API_MAINNET
          : process.env.NEXT_PUBLIC_RPC_API_DEVNET;
      const connection = new Connection(endpoint!);
      const rpc = new RpcMethods(connection);
      const ix = rpc.transferInstruction(
        owner,
        token,
        amount,
        recipient,
        keypair
      );

      const tx = RpcMethods.createTx(await ix);
      const signature = await rpc.sendTx(tx, keypair);

      await rpc.confirmTransaction(signature);

      return res.status(200).json({ tx: signature });
    } catch (e) {
      console.error('e', e);
      return res.status(500).json({ err: (e as Error).message });
    }
  })();
}
