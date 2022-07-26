import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "components/Layout";
import { Table } from "components/Table";
import { Box, StyledOcticon, Text } from "@primer/react";
import { HeartFillIcon } from "@primer/octicons-react";
import { Toast } from "components/Layout";
import { version } from "version.json";


export async function getServerSideProps() {
  const HAS_MONGO_URI = !!process.env.NEXT_PUBLIC_DATABASE_URL
  return { props: { HAS_MONGO_URI } }
}

const Home: NextPage<{HAS_MONGO_URI:boolean}> = ({HAS_MONGO_URI}) => {
    console.log("HAS_MONGO_URI",HAS_MONGO_URI)
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
          <Table hasMongoUri={HAS_MONGO_URI} />
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
          {version && <Text color="primary">Version: {version}</Text>}
        </footer>
      </Box>
    </>
  );
};

export default Home;
