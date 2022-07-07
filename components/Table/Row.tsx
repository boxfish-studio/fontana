import {
  Header,
  Text,
  Button,
  Box,
  StyledOcticon,
  TextInput,
} from "@primer/react";
import { IssueOpenedIcon, HourglassIcon } from "@primer/octicons-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useState } from "react";
import { RpcMethods } from "lib/spl";

enum Actions {
  Mint,
  Sending,
}
const Row: React.FC<{
  tokenName: string;
  tokenOwner: string;
  tokenKeypair: string;
  tokenTicker?: string;
}> = ({ tokenName, tokenOwner, tokenKeypair, tokenTicker }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [mintedAmount, setMintedAmount] = useState<null | number>(null);
  const [walletAmount, setWalletAmount] = useState<null | number>(null);
  const [action, setAction] = useState<null | Actions>(null);
  const [mintAmount, setMintAmount] = useState(1);
  const [transferAmount, setTransferAmount] = useState(1);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [mintError, setMintError] = useState<null | string>(null);
  const [sendError, setSendError] = useState<null | string>(null);

  function setWalletAddress() {
    if (!publicKey) return;
    setDestinationAddress(publicKey?.toBase58());
  }
  const getTokenBalance = useCallback(async () => {
    try{

      const rpc = new RpcMethods(connection);
      const amount = await rpc.getTokenBalance(tokenOwner, tokenName);
      setMintedAmount(amount);
      if (!publicKey) return;
      const walletAmount = await rpc.getTokenBalance(
        publicKey.toBase58(),
        tokenName
        );
        setWalletAmount(walletAmount);
      }
    catch(e){
      console.error(e);
    }
  }, [connection, publicKey, tokenName, tokenOwner]);

  getTokenBalance();

  async function mintTokens() {
    setMintError(null);
    setAction(Actions.Mint);
    if (mintAmount === 0) {
      setAction(null);
      return;
    }
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
      }
    } catch (err) {
      console.error(err);
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
      }
    } catch (err) {
      console.error(err);
    }
    setAction(null);
    getTokenBalance();
  }
  const issueColor = () => {
    if (mintedAmount === null) return "gray";
    if (mintedAmount > 0) {
      return "green";
    } else {
      return "red";
    }
  };
  return (
    <Header
      style={{
        padding: 0,
      }}
    >
      <Box
        display="flex"
        width="90rem"
        height="5rem"
        backgroundColor="white"
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
            <Text fontSize={16} fontWeight={500} margin={0} padding="0">
              Token name{" "}
              <Text
                color={"gray"}
                fontSize={14}
                fontWeight={500}
                marginLeft="1rem"
              >
                [{tokenTicker}]
              </Text>
            </Text>

            <Text fontSize={13} fontWeight={200}>
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
              borderRadius: "4px",
              borderColor: "#a0a0a0",
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
            <Button
              style={{
                position: "absolute",
                right: "0",
                bottom: "-1.6rem",
                textDecorationLine: "underline",
                border: 0,
                backgroundColor: "transparent",
                color: "gray",
                fontWeight: 400,
              }}
              onClick={setWalletAddress}
            >
              Use wallet address
            </Button>
          </Box>
          <Button
            style={{
              borderRadius: "4px",
              borderColor: "#a0a0a0",
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
  );
};

export default Row;
