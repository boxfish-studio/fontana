interface Config {
  keypair: string;
  token: string;
  owner: string;
  ticker?: string;
}

const config: Config[] = [
  {
    keypair: "WALLET_1",
    owner: "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",
    token: "Gqv2ULNwn7DpU2FRfDwagwNifX4WKPaduah43d5xJGU9",
    ticker: "test",
  },
  {
    keypair: "WALLET_2",
    owner: "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",
    token: "3ji7s3pT4j6EVx4HKFq2PUe2vw7kzzfWCSLdqsQdvk6T",
  },
  {
    keypair: "WALLET_1",
    owner: "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",
    token: "7efhjQucjgVCgijLewbJZrE16GHba9vdUzmFUdi6vwyc",
    ticker: "lol",
  },
];

export default config;
