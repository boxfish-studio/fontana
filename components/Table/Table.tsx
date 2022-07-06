import { Header, Text, Button, Box, StyledOcticon } from "@primer/react";
import { CheckIcon, SyncIcon } from "@primer/octicons-react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { RpcMethods } from "lib/spl";
import { useCallback, useEffect, useState } from "react";
import styles from "styles/MintRow.module.css";
import Row from "./Row";
import HeaderTable from "./HeaderTable";


const Table: React.FC = () => {
  return (
    <Box
      display="flex"
      margin={0}
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "0",
      }}
    >
      <HeaderTable />
      <Row tokenName="0j21d120j12j12j12j12ddj120" tokenOwner="1" />
      <Row tokenName="m0das89jdas9ndasndasdasdas09" tokenOwner="1" />
    </Box>
  );
};

export default Table;
