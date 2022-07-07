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
    keypair: "WALLET_2",
    owner:"BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu",
    token: "Gqv2ULNwn7DpU2FRfDwagwNifX4WKPaduah43d5xJGU9",
    ticker: "ETH"

  },
];

export default config;
