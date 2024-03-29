/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { RpcMethods } from 'lib/spl';
import { useCallback, useState } from 'react';
import { Actions, type RowProps, Sources } from 'types';
import { useSuccess, useConnection } from 'contexts';

export default function useMintAndTransfer({
  source,
  tokenOwner,
  tokenName,
  tokenKeypair,
}: Exclude<RowProps, 'tokenTicker'>) {
  const { connection, network } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [transferAmount, setTransferAmount] = useState(1);
  const [mintedAmount, setMintedAmount] = useState<null | number>(null);
  const [walletAmount, setWalletAmount] = useState<null | number>(null);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [mintError, setMintError] = useState<null | string>(null);
  const [sendError, setSendError] = useState<null | string>(null);
  const [action, setAction] = useState<null | Actions>(null);
  const [mintAmount, setMintAmount] = useState(1);
  const { setMessage } = useSuccess();

  const getTokenBalance = useCallback(async () => {
    if (!connection) return;
    try {
      const rpc = new RpcMethods(connection);
      const amount = await rpc.getTokenBalance(tokenOwner, tokenName);
      setMintedAmount(amount);
      if (!publicKey) return;
      const walletAmount = await rpc.getTokenBalance(
        publicKey.toBase58(),
        tokenName
      );
      setWalletAmount(walletAmount);
    } catch (e) {
      console.error(e);
    }
  }, [connection, publicKey, tokenName, tokenOwner]);

  async function mintTokens() {
    if (!connection) return;
    setMintError(null);
    setAction(Actions.Mint);
    if (mintAmount === 0) {
      setAction(null);
      return;
    }
    if (source === Sources.Wallet) {
      // mint and sign from wallet
      try {
        const rpc = new RpcMethods(connection);
        const ix = rpc.mintTokensInstruction(tokenOwner, tokenName, mintAmount);
        const tx = RpcMethods.createTx(await ix);
        const signature = await sendTransaction(tx, connection);
        await rpc.confirmTransaction(signature);
        setMessage('Success!');
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const res = await fetch('api/mint/', {
          method: 'POST',
          body: JSON.stringify({
            owner: tokenOwner,
            token: tokenName,
            keypair: tokenKeypair,
            amount: mintAmount,
            mongo: source === Sources.Db,
            network,
          }),
        });
        const data = await res.json();
        if ('err' in data) {
          setMintError(data.err);
        } else {
          setMessage('Success!');
        }
      } catch (err) {
        console.error(err);
      }
    }
    setAction(null);
    getTokenBalance();
  }
  async function transferTokens() {
    if (!connection) return;
    setSendError(null);
    setAction(Actions.Sending);
    if (transferAmount === 0) {
      setAction(null);
      return;
    }
    if (source === Sources.Wallet && publicKey) {
      // mint and sign from wallet
      try {
        const rpc = new RpcMethods(connection);
        const ata = await RpcMethods.getAssociatedTokenAccount(
          tokenName,
          destinationAddress
        );

        // determine wether ATA already initilaized
        const accInfo = await connection.getAccountInfo(ata);
        if (!accInfo) {
          const ix = createAssociatedTokenAccountInstruction(
            publicKey,
            ata,
            new PublicKey(destinationAddress),
            new PublicKey(tokenName)
          );

          const tx = RpcMethods.createTx(ix);
          try {
            const signature = await sendTransaction(tx, connection);
            await rpc.confirmTransaction(signature);
          } catch (e) {
            console.error(e);
          }
        }

        const sourceAccount = await RpcMethods.getAssociatedTokenAccount(
          tokenName,
          tokenOwner
        );

        const ix = createTransferInstruction(
          sourceAccount,
          ata,
          new PublicKey(tokenOwner),
          transferAmount
        );
        const tx = RpcMethods.createTx(ix);
        const signature = await sendTransaction(tx, connection);
        await rpc.confirmTransaction(signature);
        setMessage('Success!');
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const res = await fetch('api/transfer/', {
          method: 'POST',
          body: JSON.stringify({
            owner: tokenOwner,
            token: tokenName,
            keypair: tokenKeypair,
            amount: transferAmount,
            recipient: destinationAddress,
            mongo: source === Sources.Db,
          }),
        });
        const data = await res.json();
        if ('err' in data) {
          setSendError(data.err);
        } else {
          setMessage('Success!');
        }
      } catch (err) {
        console.error(err);
      }
    }
    setAction(null);
    getTokenBalance();
  }
  return {
    getTokenBalance,
    mintedAmount,
    walletAmount,
    setMintAmount,
    action,
    mintTokens,
    setTransferAmount,
    transferTokens,
    setDestinationAddress,
    destinationAddress,
    mintError,
    sendError,
  };
}
