import {
  Header,
  Text,
  Button,
  Box,
  StyledOcticon,
  TextInput,
} from "@primer/react";
import { IssueOpenedIcon } from "@primer/octicons-react";

const Row: React.FC<{tokenName:string, tokenOwner:string}> = ({tokenName,tokenOwner}) => {
  return (
    <Header
      style={{
        padding: 0,
      }}
    >
      <Box
        display="flex"
        width="80rem"
        height="4rem"
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
          <StyledOcticon icon={IssueOpenedIcon} size={20} color="red" />
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            margin="0"
            padding={0}
            marginLeft="1rem"
          >
            <Text fontSize={16} fontWeight="bold" margin={0} padding="0">
              Token name
            </Text>

            <Text fontWeight={30}>{tokenName}</Text>
          </Box>
        </Header.Item>
        <Header.Item
          style={{
            marginLeft: "3.5rem",
          }}
        >
          12
        </Header.Item>
        <Header.Item
          style={{
            marginLeft: "3rem",
          }}
        >
          12
        </Header.Item>
        <Header.Item
          style={{
            marginLeft: "2rem",
          }}
        >
          <TextInput width="8rem" placeholder="Amount to mint" />
          <Button
            style={{
              borderRadius: "4px",
              borderColor: "#a0a0a0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              marginLeft: "0.5rem",
            }}
          >
            <Text fontWeight={400}>Mint</Text>
          </Button>
        </Header.Item>
        <Header.Item
          full
          style={{
            gap: "0.5rem",
          }}
        >
          <TextInput width="32%" placeholder="Amount to send" />
          <TextInput width="68%" placeholder="Address to send" />
          <Button
            style={{
              borderRadius: "4px",
              borderColor: "#a0a0a0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text fontWeight={400}>Send</Text>
          </Button>
        </Header.Item>
      </Box>
    </Header>
  );
};

export default Row;
