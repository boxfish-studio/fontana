export enum Actions {
  Mint,
  Sending,
}
export interface RowProps {
  tokenName: string;
  tokenOwner: string;
  tokenKeypair?: string;
  tokenTicker?: string;
  walletAuthority?: boolean;
}
