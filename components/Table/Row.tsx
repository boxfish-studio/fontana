/* eslint-disable @typescript-eslint/no-misused-promises */
import { Header, Button, StyledOcticon } from '@primer/react';
import { IssueOpenedIcon, HourglassIcon } from '@primer/octicons-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMintAndTransfer } from 'hooks';
import { Actions, RowProps } from 'types';
import { useConnection, useRefresh } from 'contexts';
import { useEffect } from 'react';

enum IssueColor {
  Green = 'green',
  Red = 'red',
  Primary = 'primary',
}

const Row: React.FC<RowProps> = (props) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const {
    mintedAmount,
    walletAmount,
    setMintAmount,
    action,
    mintTokens,
    setTransferAmount,
    transferTokens,
    setDestinationAddress,
    destinationAddress,
    mintError,
    sendError,
    getTokenBalance,
  } = useMintAndTransfer(props);

  const { r } = useRefresh();

  useEffect(() => {
    void getTokenBalance();
  }, [r, connection]);

  function setWalletAddress() {
    if (!publicKey) return;
    setDestinationAddress(publicKey?.toBase58());
  }

  function issueColor(): IssueColor {
    if (mintedAmount === null) return IssueColor.Primary;
    if (mintedAmount > 0) {
      return IssueColor.Green;
    } else {
      return IssueColor.Red;
    }
  }

  return (
    <>
      <Header
        style={{
          padding: 0,
        }}
      >
        <div
          style={{
            gap: '16px',
            width: '90rem',
            height: '5rem',
            backgroundColor: 'white',
            padding: '13px 16px 12px',
            alignItems: 'center',
          }}
          className="d-flex color-fg-default"
        >
          <Header.Item
            style={{
              width: '18rem',
            }}
          >
            <StyledOcticon
              icon={IssueOpenedIcon}
              size={20}
              color={issueColor()}
            />
            <div className="d-flex flex-column flex-justify-center ml-3">
              <div className="f4 m-0 p-0 text-bold d-flex">
                Token name{' '}
                {props.tokenTicker && (
                  <p className="m-0 ml-3 color-fg-muted text-bold f-5">
                    [{props.tokenTicker}]
                  </p>
                )}
              </div>
              <p className="f5 text-light">{props.tokenName}</p>
            </div>
          </Header.Item>
          <Header.Item
            style={{
              fontSize: '1rem',
              width: '13rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginLeft: '2rem',
            }}
          >
            <p>{mintedAmount ?? '-'}</p>
          </Header.Item>
          <Header.Item
            style={{
              fontSize: '1rem',
              width: '13rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {walletAmount ?? '-'}
          </Header.Item>
          <Header.Item
            sx={{
              position: 'relative',
            }}
          >
            <input
              placeholder="Amount to mint"
              defaultValue={1}
              onChange={(e) => setMintAmount(parseInt(e.target.value))}
              className="p-1 rounded-2 pl-3"
              style={{
                border: '1px solid #ccc',
                width: '8rem',
              }}
            />
            <p
              className="d-flex position-absolute"
              style={{
                bottom: '-1rem',
                color: 'red',
              }}
            >
              {mintError}
            </p>
            <Button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.5rem',
                width: '5rem',
              }}
              leadingIcon={action === Actions.Mint ? HourglassIcon : null}
              onClick={mintTokens}
            >
              <div className="text-bold">Mint</div>
            </Button>
          </Header.Item>
          <Header.Item
            full
            sx={{
              position: 'relative',
              gap: '0.5rem',
            }}
          >
            <input
              placeholder="Amount to send"
              defaultValue={1}
              onChange={(e) => setTransferAmount(parseInt(e.target.value))}
              className="p-1 rounded-2 pl-3"
              style={{
                border: '1px solid #ccc',
                width: '32%',
              }}
            />
            <p
              className="d-flex position-absolute"
              style={{
                position: 'absolute',
                bottom: '-1rem',
                color: 'red',
              }}
            >
              {sendError}
            </p>
            <div
              className="d-flex flex-column position-relative"
              style={{
                width: '100%',
              }}
            >
              <input
                placeholder="Address to send"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="p-1 rounded-2 pl-3"
                style={{
                  border: '1px solid #ccc',
                }}
              />
              {publicKey && (
                <Button
                  style={{
                    position: 'absolute',
                    right: '0',
                    bottom: '-1.6rem',
                    textDecorationLine: 'underline',
                    border: 0,
                    backgroundColor: 'transparent',
                    color: 'primary',
                    fontWeight: 400,
                  }}
                  onClick={setWalletAddress}
                >
                  Use wallet address
                </Button>
              )}
            </div>
            <Button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                width: '8.5rem',
              }}
              leadingIcon={action === Actions.Sending ? HourglassIcon : null}
              onClick={transferTokens}
            >
              <div className="text-bold">Send</div>
            </Button>
          </Header.Item>
        </div>
      </Header>
    </>
  );
};

export default Row;
