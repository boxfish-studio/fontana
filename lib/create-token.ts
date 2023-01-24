import type { NewToken } from 'types';

import {
  clusterApiUrl,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { RpcMethods } from 'lib/spl';
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export async function createMint(url: string): Promise<NewToken | undefined> {
  try {
    const mint = Keypair.generate();
    const owner = Keypair.generate();
    const publicKey = owner.publicKey;
    const connection = new Connection(url);
    const rpc = new RpcMethods(connection);

    try {
      const txhash = await connection.requestAirdrop(owner.publicKey, 1e8);
      await rpc.confirmTransaction(txhash);
    } catch (e) {
      if (
        (e as Error).message.includes(
          'airdrop request limit reached for the day'
        )
      ) {
        console.error(
          'airdrop request limit reached for the day, switching to devnet official rpc'
        );
        const endpoint = clusterApiUrl('devnet');
        const connection = new Connection(endpoint);
        const txhash = await connection.requestAirdrop(owner.publicKey, 1e8);
        await rpc.confirmTransaction(txhash);
      }
    }
    const ata = await RpcMethods.getAssociatedTokenAccount(
      mint.publicKey.toBase58(),
      publicKey.toBase58()
    );
    const tx = new Transaction()
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
