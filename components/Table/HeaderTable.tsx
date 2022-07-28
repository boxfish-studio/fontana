import { Header, Text, Button, Box, StyledOcticon } from "@primer/react";
import { CheckIcon, SyncIcon } from "@primer/octicons-react";

import { useWallet } from "@solana/wallet-adapter-react";
import { useHasMongoUri, useConnection } from "contexts";
import { HourglassIcon } from "@primer/octicons-react";
import { useCreateToken } from "hooks";

const HeaderTable: React.FC<{ tokensAmount: number }> = ({
  tokensAmount = 0,
}) => {
  const { publicKey } = useWallet();
  const { hasMongoUri } = useHasMongoUri();
  const { network } = useConnection();
  const { createToken, minting, triggerRefresh } = useCreateToken();

  const canCreateToken = () => {
    if (publicKey) return true;
    if (!publicKey && hasMongoUri && network === "Devnet") return true;
    return false;
  };

  return (
    <Header
      style={{
        padding: 0,
        borderBottom: "1px solid #eaeaea",
        backgroundColor: "background",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
      }}
    >
      <Box
        color="text"
        display="flex"
        width="90rem"
        height="4rem"
        backgroundColor="transparent"
        padding="13px 16px 12px"
        alignItems="center"
        style={{ gap: "16px" }}
      >
        <Header.Item
          style={{
            display: "flex",
            width: "18rem",
            justifyContent: "flex-start",
            alignItems: "center",

          }}
        >
          <StyledOcticon icon={CheckIcon} size={16} color="primary" />
          <p className="m-0 p-0 ml-4 color-fg-muted ">
            {tokensAmount} SPL Tokens available
          </p>
        </Header.Item>
        <Header.Item
          style={{
            paddingLeft: "8rem",
            fontSize: "1.05rem",
          }}
        >
          Available
        </Header.Item>
        <Header.Item
          style={{
            paddingLeft: "6rem",
            fontSize: "1.05rem",
          }}
        >
          In wallet
        </Header.Item>
        <Header.Item
          full
          style={{
            position: "relative",
          }}
        >
          {canCreateToken() && (
            <Button
              variant="primary"
              sx={{
                position: "absolute",
                right: "8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={createToken}
              leadingIcon={minting ? HourglassIcon : null}
            >
              <Text marginLeft="4px" fontWeight={600}>
                Create token
              </Text>
            </Button>
          )}
          <Button
            sx={{
              position: "absolute",
              right: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
            onClick={triggerRefresh}
          >
            <StyledOcticon icon={SyncIcon} size={14} color="text" />
            <Text marginLeft="4px" fontWeight={600}>
              Refresh
            </Text>
          </Button>
        </Header.Item>
      </Box>
    </Header>
  );
};

export default HeaderTable;
