interface Config {
    keypair:string,
    token:string
    owner: string
    ticker?:string
}

const config: Config[] = [
  {
    keypair: "WALLET_1",
    owner:"BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",
    token: "Gqv2ULNwn7DpU2FRfDwagwNifX4WKPaduah43d5xJGU9",
    ticker: "BTC"
  },
  {
    keypair: "WALLET_1",
    owner:"BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",
    token: "Gqv2ULNwn7DpU2FRfDwagwNifX4WKPaduah43d5xJGU9",
    ticker: "ETH"

  },
  // {
  //   keypair: "env.process.WALLET_2",
  //   owner:"BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",

  //   token: "BnpFeKSs6T4m43Nj1rhyAZdkR3XcHYkzgpYVkJV7t3r6",
  // },
  // {
  //   keypair: "env.process.WALLET_1",
  //   owner:"BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",

  //   token: "BnpFeKSs6T4m43Nj1rhyAZdkR3XcHYkzgpYVkJV7t3r6",
  // },
];

export default config;
