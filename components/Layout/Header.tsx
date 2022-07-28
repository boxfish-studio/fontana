import { Box, Text } from "@primer/react";
import { FontanaSVG } from "components/Layout";

const Header: React.FC = () => {
  return (
    <Box
      position="relative"
      bg="navbarBackground"
      width="100%"
      top={0}
      left={0}
      height="4rem"
      margin={0}
      padding={0}
      display="flex"
      paddingLeft="6rem"
      alignItems="center"
      sx={{
        gap: "1rem",
      }}
    >
      <FontanaSVG width={27} />
      <Text color="white" fontWeight={600}>
        Fontana - The Solana SPL multi-token generic faucet
      </Text>
    </Box>
  );
};

export default Header;
