import {
  appendTransactionMessageInstruction,
  createKeyPairSignerFromPrivateKeyBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  devnet,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/web3.js";
import { WALLET_FILE_NAME } from "./utils/constants.ts";
import { createLogger } from "./utils/helpers.ts";
import * as Bun from "bun";
import {
  getCompleteInstructionAsync,
  parseCompleteInstruction,
} from "./clients/js/src/generated/index.ts";

const log = createLogger("airdrop");

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

const { value: latestBlockhash } = await rpc
  .getLatestBlockhash({
    commitment: "confirmed",
  })
  .send();

// Using codama's generated code, we can build the instruction as follows:
const githubUsername = "alaazorkane";
const instruction = await getCompleteInstructionAsync({
  github: Buffer.from(githubUsername, "utf8"),
  signer: keypair,
});

// We can also parse the instruction to get the PDA:
const parsedInstruction = parseCompleteInstruction(instruction);
log.info("PDA: %s", parsedInstruction.accounts.prereq.address);

// We now build the transaction message:
const txMsg = pipe(
  createTransactionMessage({
    version: 0,
  }),
  (tx) => setTransactionMessageFeePayerSigner(keypair, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstruction(instruction, tx),
);

const signedTx = await signTransactionMessageWithSigners(txMsg);

const tx = getSignatureFromTransaction(signedTx);
log.info("signature: %s", tx);
log.info("explorer url: https://explorer.solana.com/tx/%s?cluster=devnet", tx);
await sendAndConfirm(signedTx, {
  commitment: "confirmed",
});
