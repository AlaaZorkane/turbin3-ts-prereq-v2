import * as Bun from "bun";
import { LAMPORTS_PER_SOL, WALLET_FILE_NAME } from "./utils/constants.ts";
import {
  airdropFactory,
  createKeyPairSignerFromPrivateKeyBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  devnet,
  lamports,
} from "@solana/web3.js";
import { createLogger } from "./utils/helpers.ts";

const log = createLogger("airdrop");

const file = Bun.file(WALLET_FILE_NAME);
const secretKey = new Uint8Array(await file.json());

const privateKeyRaw = secretKey.slice(0, 32);
const keypair = await createKeyPairSignerFromPrivateKeyBytes(privateKeyRaw);

log.info("Signer Public Key: %s", keypair.address);

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const rpcSubscriptions = createSolanaRpcSubscriptions(
  devnet("wss://api.devnet.solana.com"),
);

const airdrop = airdropFactory({ rpc, rpcSubscriptions });

const tx = await airdrop({
  commitment: "confirmed",
  lamports: lamports(LAMPORTS_PER_SOL * 2n),
  recipientAddress: keypair.address,
});

log.info("Airdrop sent: %s", tx);
