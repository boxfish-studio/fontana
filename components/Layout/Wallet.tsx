import { Box } from "@primer/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FC } from "react";

const Wallet: FC = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        display: "flex",
        flexDirection: "row",
        margin: "1rem",
        marginTop: "0.5rem",
        zIndex: 1,
        transform: "scale(0.7)",
      }}
    >
      <WalletMultiButton />
    </Box>
  );
};

export default Wallet;
