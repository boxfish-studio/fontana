export enum Actions {
  Mint,
  Sending,
}
export enum Sources {
  Config,
  Db,
  Wallet
}
export interface RowProps {
  tokenName: string;
  tokenOwner: string;
  tokenKeypair?: string;
  tokenTicker?: string;
  source: Sources;
}
