import { Box, Text } from "@primer/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { RpcMethods } from "lib/spl";
import { useCallback, useEffect, useState } from "react";
import styles from "styles/MintRow.module.css";
import FontanaSVG from "./FontanaSVG";
const owner = "BoX451MZzydoVdZE4NFfmMT3J5Ztqo7YgUNbwwMfjPFu";

const Header: React.FC = () => {
  return (
    <Box
      position="absolute"
      backgroundColor={"#24292E"}
      width="100vw"
      top={0}
      left={0}
      height="4rem"
      display="flex"
      paddingLeft="6rem"
      alignItems="center"
      style={{
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
