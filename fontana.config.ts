interface Config {
  keypair: string;
  token: string;
  owner: string;
  ticker?: string;
  network: "devnet" | "mainnet-beta";
}

/**
 * This config is used to show the tokens to be minted and sent. Add as many as you wish. The ticker is optional.
 * The keypair is the public key of the account that will mint the tokens. It should match the keypair on the env.
 * If the keypair in the config file is WALLET_1, in the .env file it should be NEXT_PUBLIC_WALLET_1.
 */
const config: Config[] = [
  {
    keypair: "WALLET_1",
    owner: "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",
    token: "Gqv2ULNwn7DpU2FRfDwagwNifX4WKPaduah43d5xJGU9",
    ticker: "test",
    network: "devnet",
  },
  {
    keypair: "WALLET_2",
    owner: "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",
    token: "3ji7s3pT4j6EVx4HKFq2PUe2vw7kzzfWCSLdqsQdvk6T",
    network: "devnet",
  },
  {
    keypair: "WALLET_1",
    owner: "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",
    token: "7efhjQucjgVCgijLewbJZrE16GHba9vdUzmFUdi6vwyc",
    ticker: "lol",
    network: "devnet",
  },
];

export default config;
