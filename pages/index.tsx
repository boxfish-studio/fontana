import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "components/Layout";
import { Table } from "components/Table";
import { Box, StyledOcticon, Text } from "@primer/react";
import { HeartFillIcon } from "@primer/octicons-react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Fontana</title>
        <meta name="description" content="Fontana Faucet" />
        <link rel="icon" href="/Vector.ico" />
      </Head>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4rem",
        }}
      >
        <Header />
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Table />
        </Box>
        <footer
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
            width: "100vw",
            marginBottom: "2rem",
          }}
        >
          <Text color="gray">
            with{" "}
            <StyledOcticon icon={HeartFillIcon} size={16} color="#666666" />{" "}
            From{" "}
            <a href="https://boxfish.studio/">
              <u>Boxfish Studio</u>
            </a>
            , SL.
          </Text>
        </footer>
      </Box>
    </>
  );
};

export default Home;
