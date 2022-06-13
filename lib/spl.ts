import { Connection, PublicKey } from "@solana/web3.js";

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
}
