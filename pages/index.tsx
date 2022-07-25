import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "components/Layout";
import { Table } from "components/Table";
import { Box, StyledOcticon, Text } from "@primer/react";
import { HeartFillIcon } from "@primer/octicons-react";
import { Toast } from "components/Layout";

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
          height: "auto",
        }}
      >
        <Header />
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          overflowY={"auto"}
          padding={"0.5rem"}
          marginBottom={"5rem"}
        >
          <Table />
        </Box>
        <Toast />
        <footer
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
            width: "100vw",
            paddingTop: "4rem",
            marginTop: "4rem",
            marginBottom: "2rem",
            position: "fixed",
            bottom: "0",
            left: 0,
          }}
        >
          <Text color="primary">
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
