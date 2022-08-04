<h1 align="center">
  <br>
  <a href="https://boxfish.studio"><img src="doc/img/gh-splash.png" title="Fontana. By Boxfish Studio"></a>
</h1>

<h1 align="center">Fontana</h1>

<p align="center">A simple dashboard to manage Solana SPL tokens</p>

<p align="center">
<a href="https://fontana.boxfish.studio/">fontana.boxfish.studio</a>
</p>


<p align="center">
  <a aria-label="build status" href="https://github.com/boxfish-studio/fontana/actions/workflows/deploy_prod.yaml">
    <img alt="" src="https://github.com/boxfish-studio/fontana/actions/workflows/deploy_prod.yaml/badge.svg">
  </a>
  <a aria-label="contributors graph" href="https://github.com/boxfish-studio/fontana/graphs/contributors">
    <img alt="" src="https://img.shields.io/github/contributors/boxfish-studio/fontana.svg">
  </a>
  <a aria-label="last commit" href="https://github.com/boxfish-studio/fontana/commits/main">
    <img alt="" src="https://img.shields.io/github/last-commit/boxfish-studio/fontana.svg">
  </a>
  <a aria-label="license" href="https://github.com/boxfish-studio/fontana/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/boxfish-studio/fontana.svg" alt="">
  </a>
</p>

---

## Features

- Create, mint, and transfer SPL tokens
- Mainnet and devnet support
- Configurable RPCs
- Compatible with Phantom, Solflare, Torus, Sollet, Glow and Slope wallets
- Wallet and server operation modes


## Using the program

### Wallet mode

When using this mode, the creation, minting and transfer of tokens will be performed by the connected wallet account.
The displayed available tokens will be the ones belonging to the wallet account plus the ones available in server mode.

This mode is only operational when a wallet is connected.

### Server mode

When using this mode, the creation, minting and transfer of tokens is performed by a configured account in the server.
Newly created tokens will be stored in a dedicated database. The displayed tokens will be those configured within the application config file, plus the later added tokens stored in the database.

When using mainnet in this mode, the creation of new tokens is not enabled by default, since it would require for an account with real funds configured in the server.

This mode is only operational when no wallet is connected.


## Run

Clone the repo, and run the development server:

```bash
yarn dev 
```

The app will open at [http://localhost:3000](http://localhost:3000).

## License

[Apache 2.0](./LICENSE) &copy; [Boxfish Studio]


[Boxfish Studio]: https://boxfish.studio

