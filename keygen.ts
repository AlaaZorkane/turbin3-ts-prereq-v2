import { getAddressFromPublicKey, getBase58Decoder } from "@solana/web3.js";
import { createLogger } from "./utils/helpers.ts";
import { generateKeyPair, getPrivateKeyFromKeypair } from "./utils/keypair.ts";
import * as Bun from "bun";
import { WALLET_FILE_NAME } from "./utils/constants.ts";
import { green, bold } from "yoctocolors";

const log = createLogger("keygen");

const kp = await generateKeyPair(true);
const publicKey = await getAddressFromPublicKey(kp.publicKey);

const rawPrivateKey = await getPrivateKeyFromKeypair(kp);
const secretKey = getBase58Decoder().decode(rawPrivateKey);
const secretKeyUint8 = new Uint8Array(rawPrivateKey);

log.info("Public Key: %s", publicKey);
log.info("Secret Key (bs58): %s", secretKey);
log.info("Secret Key (uint8): [%s]", secretKeyUint8);

const shouldExport = process.argv.includes("export");

if (shouldExport) {
  const file = Bun.file(WALLET_FILE_NAME);
  const fileExists = await file.exists();

  if (fileExists) {
    log.warn("File already exists, skipping export");
    process.exit(0);
  }

  await Bun.write(file, JSON.stringify(Array.from(secretKeyUint8)));
  log.info("Exported to %s", bold(green(WALLET_FILE_NAME)));
}
