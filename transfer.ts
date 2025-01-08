import * as Bun from "bun";
import {
  LAMPORTS_PER_SOL,
  TURBIN_PUBLIC_KEY,
  WALLET_FILE_NAME,
} from "./utils/constants.ts";
import {
  appendTransactionMessageInstruction,
  compileTransactionMessage,
  createKeyPairSignerFromPrivateKeyBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  devnet,
  getBase64Decoder,
  getCompiledTransactionMessageEncoder,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type TransactionMessageBytes,
  type TransactionMessageBytesBase64,
} from "@solana/web3.js";
import { createLogger } from "./utils/helpers.ts";
import { getTransferSolInstruction } from "@solana-program/system";

const log = createLogger("transfer");

const file = Bun.file(WALLET_FILE_NAME);
const secretKey = new Uint8Array(await file.json());

const privateKeyRaw = secretKey.slice(0, 32);
const keypair = await createKeyPairSignerFromPrivateKeyBytes(privateKeyRaw);
const keypairPublicKey = keypair.address;

log.info("Signer Public Key: %s", keypairPublicKey);

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const rpcSubscriptions = createSolanaRpcSubscriptions(
  devnet("wss://api.devnet.solana.com"),
);
const sendAndConfirm = sendAndConfirmTransactionFactory({
  rpc,
  rpcSubscriptions,
});

const transfer = async () => {
  log.info("Starting transfer transaction...");
  const transferInstruction = getTransferSolInstruction({
    amount: LAMPORTS_PER_SOL / 100n,
    source: keypair,
    destination: TURBIN_PUBLIC_KEY,
  });

  const { value: latestBlockhash } = await rpc
    .getLatestBlockhash({
      commitment: "confirmed",
    })
    .send();

  log.info("latestBlockhash: %s", latestBlockhash.blockhash);

  const txMsg = pipe(
    createTransactionMessage({
      version: 0,
    }),
    (tx) => setTransactionMessageFeePayerSigner(keypair, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstruction(transferInstruction, tx),
  );

  const signedTx = await signTransactionMessageWithSigners(txMsg);

  const tx = getSignatureFromTransaction(signedTx);
  log.info("signature: %s", tx);
  log.info(
    "explorer url: https://explorer.solana.com/tx/%s?cluster=devnet",
    tx,
  );

  await sendAndConfirm(signedTx, {
    commitment: "confirmed",
  });

  log.info("Transfer transaction completed!");
};

const drain = async () => {
  log.info("Starting draining transaction...");

  const { value: balance } = await rpc
    .getBalance(keypairPublicKey, {
      commitment: "confirmed",
    })
    .send();

  const { value: latestBlockhash } = await rpc
    .getLatestBlockhash({
      commitment: "confirmed",
    })
    .send();

  // We construct a new root transaction message with the same fee payer and lifetime
  // We will later use this to both preview the fee and the actual transaction
  const rootTxMsg = pipe(
    createTransactionMessage({
      version: 0,
    }),
    (tx) => setTransactionMessageFeePayerSigner(keypair, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  );

  const previewTransferInstruction = getTransferSolInstruction({
    amount: balance,
    source: keypair,
    destination: TURBIN_PUBLIC_KEY,
  });
  const previewTxMsg = pipe(rootTxMsg, (tx) =>
    appendTransactionMessageInstruction(previewTransferInstruction, tx),
  );

  // In order to preview the fee, we need to compile the transaction message
  // and then encode it to a base64 string to send it to the RPC
  const compiledTx = compileTransactionMessage(previewTxMsg);
  const messageBytes = getCompiledTransactionMessageEncoder().encode(
    compiledTx,
  ) as TransactionMessageBytes;
  const messageBytesBase64 = getBase64Decoder().decode(
    messageBytes,
  ) as TransactionMessageBytesBase64;
  const { value: fee } = await rpc
    .getFeeForMessage(messageBytesBase64, {
      commitment: "confirmed",
    })
    .send();

  const feeLamports = fee ? lamports(fee) : lamports(0n);
  log.info("fee: %s", feeLamports);

  // Now that we have the fee, we can construct the actual transaction
  // We will use the same root transaction message as before but with different instruction params
  const transferInstruction = getTransferSolInstruction({
    amount: balance - feeLamports,
    source: keypair,
    destination: TURBIN_PUBLIC_KEY,
  });
  const txMsg = pipe(rootTxMsg, (tx) =>
    appendTransactionMessageInstruction(transferInstruction, tx),
  );

  const signedTx = await signTransactionMessageWithSigners(txMsg);
  const tx = getSignatureFromTransaction(signedTx);
  log.info("signature: %s", tx);
  log.info(
    "explorer url: https://explorer.solana.com/tx/%s?cluster=devnet",
    tx,
  );

  // Finally, we send and confirm the transaction
  await sendAndConfirm(signedTx, {
    commitment: "confirmed",
    skipPreflight: true,
  });

  log.info("Draining transaction completed!");
};

try {
  await transfer();
  await drain();
} catch (error) {
  log.warn("Oops, something went wrong.");
  log.error(error);
}
