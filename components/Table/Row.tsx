import {
  Header,
  Text,
  Button,
  Box,
  StyledOcticon,
  TextInput,
} from "@primer/react";
import { IssueOpenedIcon, HourglassIcon } from "@primer/octicons-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useMintAndTransfer } from "hooks";
import { Actions, RowProps, Sources } from "types";
import { useRefresh } from "contexts";

enum IssueColor {
  Green = "green",
  Red = "red",
  Primary = "primary",
}

const Row: React.FC<RowProps> = (props) => {
  const { publicKey } = useWallet();
  const {
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
  } = useMintAndTransfer(props);

  const { r } = useRefresh();

  function setWalletAddress() {
    if (!publicKey) return;
    setDestinationAddress(publicKey?.toBase58());
  }

  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance, r]);

  function issueColor(): IssueColor {
    if (mintedAmount === null) return IssueColor.Primary;
    if (mintedAmount > 0) {
      return IssueColor.Green;
    } else {
      return IssueColor.Red;
    }
  }

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
                {props.tokenTicker && (
                  <Text
                    color={"primary"}
                    fontSize={14}
                    fontWeight="600"
                    marginLeft="1rem"
                  >
                    [{props.tokenTicker}]
                  </Text>
                )}
              </Text>

              <Text fontSize={13} fontWeight="light">
                {props.tokenName}
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
    </>
  );
};

export default Row;
