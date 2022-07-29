import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "components/Layout";
import { Table } from "components/Table";
import { StyledOcticon } from "@primer/react";
import { HeartFillIcon } from "@primer/octicons-react";
import { Toast } from "components/Layout";
import { version } from "version.json";
import { HasMongoUriContext } from "contexts";

export async function getServerSideProps() {
  const HAS_MONGO_URI = !!process.env.NEXT_PUBLIC_DATABASE_URL;
  return { props: { HAS_MONGO_URI } };
}

const Home: NextPage<{ HAS_MONGO_URI: boolean }> = ({ HAS_MONGO_URI }) => {
  return (
    <>
      <Head>
        <title>Fontana</title>
        <meta name="description" content="Fontana Faucet" />
        <link rel="icon" href="/Vector.ico" />
      </Head>
      <div
        className="d-flex flex-justify-center flex-items-center flex-column h-auto"
        style={{
          gap: "4rem",
        }}
      >
        <Header />
        <div className="d-flex flex-column flex-justify-center flex-items-center p-2 mb-10">
          <HasMongoUriContext.Provider value={{ hasMongoUri: HAS_MONGO_URI }}>
            <Table />
          </HasMongoUriContext.Provider>
        </div>
        <Toast />
        <footer>
          <p className="color-fg-muted">
            with{" "}
            <StyledOcticon icon={HeartFillIcon} size={16} color="#666666" />{" "}
            From{" "}
            <a href="https://divfish.studio/">
              <u>Boxfish Studio</u>
            </a>
            , SL.
          </p>
          {version && <p className="color-fg-muted">Version: {version}</p>}
        </footer>
      </div>
    </>
  );
};

export default Home;
