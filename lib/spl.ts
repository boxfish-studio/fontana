import {
  Connection,
  Keypair,
  ParsedAccountData,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  createMintToInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  AccountLayout,
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
    if (tokens.value.length === 0) return 0;
    const amount = parseInt(
      tokens.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.amount
    );
    return amount;
  }

  static async getAssociatedTokenAccount(token: string, owner: string) {
    return await getAssociatedTokenAddress(
      new PublicKey(token),
      new PublicKey(owner)
    );
  }
  public async getOrCreateAssociatedTokenAccount(
    token: string,
    signer: Keypair,
    recipient: string
  ) {
    return await getOrCreateAssociatedTokenAccount(
      this.connection,
      signer,
      new PublicKey(token),
      new PublicKey(recipient)
    );
  }
  async mintTokensInstruction(
    owner: string,
    token: string,
    amount: number
  ): Promise<TransactionInstruction> {
    const tokenAccount = await RpcMethods.getAssociatedTokenAccount(token, owner);

    const tx = createMintToInstruction(
      new PublicKey(token),
      tokenAccount,
      new PublicKey(owner),
      amount
    );
    return tx;
  }

  async transferInstruction(
    owner: string,
    token: string,
    amount: number,
    recipient: string,
    signer: Keypair
  ): Promise<TransactionInstruction> {
    const sourceAccount = await RpcMethods.getAssociatedTokenAccount(token, owner);
    const destinationAccount = await this.getOrCreateAssociatedTokenAccount(
      token,
      signer,
      recipient
    );
    const tx = createTransferInstruction(
      sourceAccount,
      destinationAccount.address,
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
    const blockhash = await this.connection.getLatestBlockhash();
    return blockhash;
  }

  async confirmTransaction(signature: string) {
    const latestBlockHash = await this.getLatestBlockhash();
    await this.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature,
    });
  }

  async queryTokenByAuthority(pubkey: string): Promise<
    Array<{
      tokenMint: string;
    }>
  > {
    const tokenAccounts = await this.connection.getTokenAccountsByOwner(
      new PublicKey(pubkey),
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
    const accounts = await tokenAccounts.value.reduce(async (acc, e) => {
      const accountInfo = AccountLayout.decode(e.account.data);
      const accountParsed = await this.connection.getParsedAccountInfo(
        new PublicKey(accountInfo.mint)
      );
      const accountData = accountParsed.value?.data;
      if (
        (accountData as ParsedAccountData).parsed.info.mintAuthority !== pubkey
      ) {
        return Promise.resolve([...(await acc)]);
      }
      return Promise.resolve([
        ...(await acc),
        { tokenMint: accountInfo.mint.toBase58() },
      ]);
    }, Promise.resolve([{ tokenMint: "" }]));
    // return all but the first one which is the initial value in the reduced array.
    return accounts.slice(1);
  }
}
