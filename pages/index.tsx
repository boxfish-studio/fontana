/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { NextPage } from 'next';
import Head from 'next/head';
import { Header } from 'components/Layout';
import { Table } from 'components/Table';
import { StyledOcticon } from '@primer/react';
import { HeartFillIcon } from '@primer/octicons-react';
import { Toast } from 'components/Layout';
import { version } from 'version.json';
import { HasMongoUriContext } from 'contexts';

export function getServerSideProps() {
  const HAS_MONGO_URI = !!process.env.NEXT_PUBLIC_DATABASE_URL;
  return { props: { HAS_MONGO_URI } };
}

const Home: NextPage<{ HAS_MONGO_URI: boolean }> = ({ HAS_MONGO_URI }) => (
  <>
    <Head>
      <title>Fontana</title>
      <meta name="description" content="Fontana Faucet" />
      <link rel="icon" href="/Vector.ico" />
    </Head>
    <div
      className="d-flex flex-justify-center flex-items-center flex-column h-auto"
      style={{
        gap: '4rem',
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
        <div>
          <a href="https://github.com/boxfish-studio/fontana/">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="color-fg-muted"
              style={{ cursor: 'pointer' }}
            >
              <u>Fontana {version}</u>
            </a>
          </a>
          <span className="color-fg-muted"> - by </span>
          <a href="https://boxfish.studio/">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="color-fg-muted"
              style={{ cursor: 'pointer' }}
            >
              <u>Boxfish Studio</u>
            </a>
          </a>
        </div>
      </footer>
    </div>
  </>
);

export default Home;
