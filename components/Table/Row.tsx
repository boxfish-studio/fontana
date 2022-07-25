import {
  Header,
  Text,
  Button,
  Box,
  StyledOcticon,
  TextInput,
  Flash,
} from "@primer/react";
import {
  IssueOpenedIcon,
  HourglassIcon,
  CheckIcon,
} from "@primer/octicons-react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState, useRef } from "react";
import { RpcMethods } from "lib/spl";
import { useRefresh } from "./Table";
import { useHandleDestroyAnimated } from "hooks";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
enum Actions {
  Mint,
  Sending,
}
const Row: React.FC<{
  tokenName: string;
  tokenOwner: string;
  tokenKeypair?: string;
  tokenTicker?: string;
  walletAuthority?: boolean;
}> = ({
  tokenName,
  tokenOwner,
  tokenKeypair,
  tokenTicker,
  walletAuthority,
}) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const w = useAnchorWallet();
  const [mintedAmount, setMintedAmount] = useState<null | number>(null);
  const [walletAmount, setWalletAmount] = useState<null | number>(null);
  const [action, setAction] = useState<null | Actions>(null);
  const [mintAmount, setMintAmount] = useState(1);
  const [transferAmount, setTransferAmount] = useState(1);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [mintError, setMintError] = useState<null | string>(null);
  const [sendError, setSendError] = useState<null | string>(null);
  const { r } = useRefresh();
  const flashRef = useRef<null | HTMLDivElement>(null);

  const [sendSuccess, setSendSuccess] = useHandleDestroyAnimated(flashRef);
  function setWalletAddress() {
    if (!publicKey) return;
    setDestinationAddress(publicKey?.toBase58());
  }
  const getTokenBalance = useCallback(async () => {
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

  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance, r]);

  async function mintTokens() {
    setMintError(null);
    setAction(Actions.Mint);
    if (mintAmount === 0) {
      setAction(null);
      return;
    }
    if (walletAuthority) {
      // mint and sign from wallet
      try {
        const rpc = new RpcMethods(connection);
        const ix = rpc.mintTokensInstruction(tokenOwner, tokenName, mintAmount);
        const tx = RpcMethods.createTx(await ix);
        const signature = await sendTransaction(tx, connection);
        await rpc.confirmTransaction(signature);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const res = await fetch("api/mint/", {
          method: "POST",
          body: JSON.stringify({
            owner: tokenOwner,
            token: tokenName,
            keypair: tokenKeypair,
            amount: mintAmount,
          }),
        });
        const data = await res.json();
        if ("err" in data) {
          setMintError(data.err);
        } else {
          setSendSuccess(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setAction(null);
    getTokenBalance();
  }
  async function transferTokens() {
    setSendError(null);
    setAction(Actions.Sending);
    if (transferAmount === 0) {
      setAction(null);
      return;
    }
    if (walletAuthority && publicKey) {
      // mint and sign from wallet
      try {
        const rpc = new RpcMethods(connection);
        const ata = await rpc.getAssociatedTokenAccount(
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

        const sourceAccount = await rpc.getAssociatedTokenAccount(
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
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const res = await fetch("api/transfer/", {
          method: "POST",
          body: JSON.stringify({
            owner: tokenOwner,
            token: tokenName,
            keypair: tokenKeypair,
            amount: transferAmount,
            recipient: destinationAddress,
          }),
        });
        const data = await res.json();
        if ("err" in data) {
          setSendError(data.err);
        } else {
          setSendSuccess(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setAction(null);
    getTokenBalance();
  }
  const issueColor = () => {
    if (mintedAmount === null) return "primary";
    if (mintedAmount > 0) {
      return "green";
    } else {
      return "red";
    }
  };

  return (
    <>
      <Header
        style={{
          padding: 0,
        }}
      >
        <Box
          color="text"
          display="flex"
          width="90rem"
          height="5rem"
          backgroundColor="background"
          padding="13px 16px 12px"
          alignItems="center"
          style={{ gap: "16px" }}
        >
          <Header.Item
            style={{
              width: "18rem",
            }}
          >
            <StyledOcticon
              icon={IssueOpenedIcon}
              size={20}
              color={issueColor()}
            />
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              margin="0"
              padding={0}
              marginLeft="1rem"
            >
              <Text fontSize={17} fontWeight={600} margin={0} padding="0">
                Token name{" "}
                {tokenTicker && (
                  <Text
                    color={"primary"}
                    fontSize={14}
                    fontWeight="600"
                    marginLeft="1rem"
                  >
                    [{tokenTicker}]
                  </Text>
                )}
              </Text>

              <Text fontSize={13} fontWeight="light">
                {tokenName}
              </Text>
            </Box>
          </Header.Item>
          <Header.Item
            style={{
              fontSize: "1rem",
              width: "13rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginLeft: "2rem",
            }}
          >
            <Text textAlign={"center"}>{mintedAmount ?? "-"}</Text>
          </Header.Item>
          <Header.Item
            style={{
              fontSize: "1rem",
              width: "13rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {walletAmount ?? "-"}
          </Header.Item>
          <Header.Item
            sx={{
              position: "relative",
            }}
          >
            <TextInput
              width="8rem"
              placeholder="Amount to mint"
              defaultValue={1}
              onChange={(e) => setMintAmount(parseInt(e.target.value))}
              sx={{
                border: "1px solid #ccc",
              }}
            />
            <Text
              display="flex"
              sx={{
                position: "absolute",
                bottom: "-1rem",
              }}
              color="red"
            >
              {mintError}
            </Text>
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "0.5rem",
                width: "5rem",
              }}
              leadingIcon={action === Actions.Mint ? HourglassIcon : null}
              onClick={mintTokens}
            >
              <Text fontWeight={600}>Mint</Text>
            </Button>
          </Header.Item>
          <Header.Item
            full
            sx={{
              position: "relative",
              gap: "0.5rem",
            }}
          >
            <TextInput
              width="32%"
              placeholder="Amount to send"
              defaultValue={1}
              onChange={(e) => setTransferAmount(parseInt(e.target.value))}
              sx={{
                border: "1px solid #ccc",
              }}
            />
            <Text
              display="flex"
              sx={{
                position: "absolute",
                bottom: "-1rem",
              }}
              color="red"
            >
              {sendError}
            </Text>
            <Box
              display={"flex"}
              flexDirection={"column"}
              width="100%"
              position={"relative"}
            >
              <TextInput
                placeholder="Address to send"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                sx={{
                  border: "1px solid #ccc",
                }}
              />
              {publicKey && (
                <Button
                  style={{
                    position: "absolute",
                    right: "0",
                    bottom: "-1.6rem",
                    textDecorationLine: "underline",
                    border: 0,
                    backgroundColor: "transparent",
                    color: "primary",
                    fontWeight: 400,
                  }}
                  onClick={setWalletAddress}
                >
                  Use wallet address
                </Button>
              )}
            </Box>
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                width: "8.5rem",
              }}
              leadingIcon={action === Actions.Sending ? HourglassIcon : null}
              onClick={transferTokens}
            >
              <Text fontWeight={600}>Send</Text>
            </Button>
          </Header.Item>
        </Box>
      </Header>
      {sendSuccess && (
        <div
          ref={flashRef}
          id="send-success"
          style={{
            position: "absolute",
            bottom: "2rem",
            right: "2rem",
            width: "20rem",
            fontSize: "1.1rem",
          }}
        >
          <Flash variant="success">
            <StyledOcticon icon={CheckIcon} />
            Success!
          </Flash>
        </div>
      )}
    </>
  );
};

export default Row;
