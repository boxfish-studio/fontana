import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createMintToInstruction,
  createTransferInstruction,
} from "@solana/spl-token";

abstract class Rpc {
  connection: Connection;
  constructor(connection: Connection) {
    this.connection = connection;
  }
}

export class RpcMethods extends Rpc {
  constructor(connection: Connection) {
    super(connection);
  }
  async getTokenBalance(owner: string, token: string): Promise<number> {
    const tokens = await this.connection.getParsedTokenAccountsByOwner(
      new PublicKey(owner),
      {
        mint: new PublicKey(token),
      }
    );
    const amount = parseInt(
      tokens.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.amount
    );
    return amount;
  }

  private async getAssociatedTokenAccount(token: string, owner: string) {
    return await getAssociatedTokenAddress(
      new PublicKey(token),
      new PublicKey(owner)
    );
  }
  async mintTokensInstruction(
    owner: string,
    token: string,
    amount: number
  ): Promise<TransactionInstruction> {
    const tokenAccount = await this.getAssociatedTokenAccount(token, owner);

    const tx = createMintToInstruction(
      new PublicKey(token),
      tokenAccount,
      new PublicKey(owner),
      amount
    );
    console.log("tx", tx);
    return tx;
  }

  async transferInstruction(
    owner: string,
    token: string,
    amount: number,
    recipient: string
  ): Promise<TransactionInstruction> {
    const sourceAccount = await this.getAssociatedTokenAccount(token, owner);
    const destinationAccount = await this.getAssociatedTokenAccount(
      token,
      recipient
    );
    const tx = createTransferInstruction(
      sourceAccount,
      destinationAccount,
      new PublicKey(owner),
      amount
    );
    return tx;
  }

  static createTx(...instructions: TransactionInstruction[]): Transaction {
    let transaction = new Transaction();
    transaction.add(...instructions);
    return transaction;
  }

  async sendTx(transaction: Transaction, signer: Keypair): Promise<string> {
    const signature = await this.connection.sendTransaction(transaction, [
      signer,
    ]);
    return signature;
  }

  private async getLatestBlockhash(): Promise<
    Readonly<{
      blockhash: string;
      lastValidBlockHeight: number;
    }>
  > {
    return await this.connection.getLatestBlockhash();
  }

  async confirmTransaction(signature: string) {
    const latestBlockHash = await this.getLatestBlockhash();
    await this.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature,
    });
  }
}
