import { Header, Text, Button, Box, StyledOcticon } from "@primer/react";
import { CheckIcon, SyncIcon } from "@primer/octicons-react";
import { useRefresh } from './Table'

const HeaderTable: React.FC = () => {
  const { r,refresh } = useRefresh()

  function triggerRefresh(){
    refresh(!r)
  }
  return (
    <Header
      style={{
        padding: 0,
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <Box
        display="flex"
        width="90rem"
        height="4rem"
        backgroundColor="white"
        padding="13px 16px 12px"
        alignItems="center"
        borderTopLeftRadius={5}
        borderTopRightRadius={5}
        style={{ gap: "16px" }}
      >
        <Header.Item
          style={{
            width: "18rem",
          }}
        >
          <StyledOcticon icon={CheckIcon} size={16} color="gray" />
          <Text as="p" marginLeft="0.5rem" color="gray">
            2 SPL Tokens available
          </Text>
        </Header.Item>
        <Header.Item
          style={{
            paddingLeft: "8rem",
          }}
        >
          Available
        </Header.Item>
        <Header.Item
         style={{
          paddingLeft: "6rem",
        }}
        >In wallet</Header.Item>
        <Header.Item
          full
          style={{
            position: "relative",
          }}
        >
          <Button
            sx={{
              position: "absolute",
              right: "0",
              borderRadius: "4px",
              borderColor: "#a0a0a0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
            onClick={triggerRefresh}
          >
            <StyledOcticon icon={SyncIcon} size={14} color="black" />
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
