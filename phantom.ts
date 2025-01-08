import promptSync from "prompt-sync";
import {
  createKeyPairSignerFromPrivateKeyBytes,
  getAddressDecoder,
  getBase58Encoder,
} from "@solana/web3.js";
import { createLogger } from "./utils/helpers.ts";
import { getPrivateKeyFromKeypair } from "./utils/keypair.ts";

const log = createLogger("phantom");

log.info(
  "Small utility to help you convert from/to base58 encoded secret keys.",
);

const input = promptSync();

const raw = input(
  "[+] Please enter your private key (in base58 or array uint8): \n> ",
);

if (raw.startsWith("[")) {
  const uint8Array = new Uint8Array(JSON.parse(raw));
  const privateKeyRaw = uint8Array.slice(0, 32);
  const keypair = await createKeyPairSignerFromPrivateKeyBytes(
    privateKeyRaw,
    true,
  );
  const secretKeyRaw = await getPrivateKeyFromKeypair(keypair.keyPair);
  const privateKey = getAddressDecoder().decode(secretKeyRaw);
  const publicKey = getAddressDecoder().decode(secretKeyRaw, 32);
  const secretKey = privateKey + publicKey;

  log.info("Public Key (bs58): %s", keypair.address);
  log.info("Secret Key (phantom): %s", secretKey);
  log.info("Private Key (bs58): %s", privateKey);
  log.info("Secret key (uint8[]): [%s]", Array.from(uint8Array));
} else {
  const privateKeyBs58 = raw.slice(0, 44);
  const publicKeyBs58 = raw.slice(44, 88);
  const privateKeyBytes = getBase58Encoder().encode(privateKeyBs58);
  const publicKeyBytes = getBase58Encoder().encode(publicKeyBs58);
  const secretKeyBytes = new Uint8Array([
    ...privateKeyBytes,
    ...publicKeyBytes,
  ]);
  const secretKeyBs58 = privateKeyBs58 + publicKeyBs58;

  log.info("Public Key (bs58): %s", publicKeyBs58);
  log.info("Secret Key (phantom): %s", secretKeyBs58);
  log.info("Private Key (bs58): %s", privateKeyBs58);
  log.info("Secret Key (uint8[]): [%s]", Array.from(secretKeyBytes));
}
