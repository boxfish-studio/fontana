import { Header, Text, Button, Box, StyledOcticon, Flash } from "@primer/react";
import { CheckIcon, SyncIcon } from "@primer/octicons-react";
import { useRefresh, useSuccess } from "./Table";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { RpcMethods } from "lib/spl";

const HeaderTable: React.FC<{ tokensAmount: number }> = ({
  tokensAmount = 0,
}) => {
  const { r, refresh } = useRefresh();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { setMessage, setMint } = useSuccess();

  function triggerRefresh() {
    refresh(!r);
  }
  async function createToken() {
    if (!publicKey) return;
    try {
      const mint = Keypair.generate();

      const rpc = new RpcMethods(connection);

      const ata = await rpc.getAssociatedTokenAccount(
        mint.publicKey.toBase58(),
        publicKey.toBase58()
      );

      let tx = new Transaction()
        .add(
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: mint.publicKey,
            space: MINT_SIZE,
            lamports: await getMinimumBalanceForRentExemptMint(connection),
            programId: TOKEN_PROGRAM_ID,
          })
        )
        .add(
          createInitializeMintInstruction(
            mint.publicKey,
            0,
            publicKey,
            publicKey
          )
        )
        .add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            ata,
            publicKey,
            mint.publicKey
          )
        );
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = publicKey;
      tx.sign(mint);
      const signature = await sendTransaction(tx, connection);
      await rpc.confirmTransaction(signature);
      triggerRefresh();
      setMessage(
        `Success! New mint ${mint.publicKey
          .toBase58()
          .slice(0, 12)}... created.`
      );
      setMint(mint.publicKey.toBase58());
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <Header
      style={{
        padding: 0,
        borderBottom: "1px solid #eaeaea",
        backgroundColor: "background",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
      }}
    >
      <Box
        color="text"
        display="flex"
        width="90rem"
        height="4rem"
        backgroundColor="transparent"
        padding="13px 16px 12px"
        alignItems="center"
        style={{ gap: "16px" }}
      >
        <Header.Item
          style={{
            width: "18rem",
          }}
        >
          <StyledOcticon icon={CheckIcon} size={16} color="primary" />
          <Text as="p" marginLeft="0.5rem" color="primary">
            {tokensAmount} SPL Tokens available
          </Text>
        </Header.Item>
        <Header.Item
          style={{
            paddingLeft: "8rem",
            fontSize: "1.05rem",
          }}
        >
          Available
        </Header.Item>
        <Header.Item
          style={{
            paddingLeft: "6rem",
            fontSize: "1.05rem",
          }}
        >
          In wallet
        </Header.Item>
        <Header.Item
          full
          style={{
            position: "relative",
          }}
        >
          {publicKey && (
            <Button
              variant="primary"
              sx={{
                position: "absolute",
                right: "8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
              }}
              onClick={createToken}
            >
              <Text marginLeft="4px" fontWeight={600}>
                Create token
              </Text>
            </Button>
          )}
          <Button
            sx={{
              position: "absolute",
              right: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
            onClick={triggerRefresh}
          >
            <StyledOcticon icon={SyncIcon} size={14} color="text" />
            <Text marginLeft="4px" fontWeight={600}>
              Refresh
            </Text>
          </Button>
        </Header.Item>
      </Box>
    </Header>
  );
};

export default HeaderTable;
