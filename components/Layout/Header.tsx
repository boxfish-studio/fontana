import { Box, Text } from "@primer/react";
import { FontanaSVG } from "components/Layout";
import { NetworkSelector, Wallet } from "components/Layout";
const Header: React.FC = () => {
  return (
    <Box
      position="relative"
      bg="navbarBackground"
      width="100vw"
      top={0}
      left={0}
      height="4rem"
      display="flex"
      paddingLeft="6rem"
      alignItems="center"
      sx={{
        gap: "1rem",
        justifyContent: "space-between",
      }}
    >
      <div className="d-flex flex-justify-center flex-items-center">
        <FontanaSVG width={27} />
        <Text color="white" fontWeight={600} className="ml-2">
          Fontana - The Solana SPL multi-token generic faucet
        </Text>
      </div>
      <div className="d-flex flex-justify-center flex-items-center">
        <NetworkSelector />
        <Wallet />
      </div>
    </Box>
  );
};

export default Header;
