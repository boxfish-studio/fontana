import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { GetStaticProps } from "next";
import { MintRow } from "components/Layout";

const BADGES = ["SOLO", "CREW", "CLAN", "SQUAD", "LEGION", "EMPIRE"];

interface Props {
  SPL_TOKENS: string[];
}

export const getServerSideProps: GetStaticProps<Props> = async () => {
  const SPL_TOKENS = BADGES.map(
    (badge) => process.env[`NEXT_PUBLIC_WL_MINT_${badge.toUpperCase()}`]
  ) as string[];

  return {
    props: {
      SPL_TOKENS,
    },
  };
};

const Home: NextPage<Props> = ({ SPL_TOKENS }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Synergyland Faucet</title>
        <meta name="description" content="Synergyland Faucet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Synergyland Faucet</h1>
        <hr />
      </div>
      <main className={styles.main}>
        {SPL_TOKENS.map((token, i) => (
          <MintRow key={token} token={token} badge={BADGES[i]} />
        ))}
      </main>
    </div>
  );
};

export default Home;
