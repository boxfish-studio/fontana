import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
  mintTo,
  createMintToInstruction,
} from "@solana/spl-token";
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react";

abstract class rpc {
  connection: Connection;
  constructor(connection: Connection) {
    this.connection = connection;
  }
}

export class rpcMethods extends rpc {
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
  async mintTokens(
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
    return tx;
  }
}
