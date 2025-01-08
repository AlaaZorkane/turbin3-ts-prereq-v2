import promptSync from "prompt-sync";
import {
  createKeyPairSignerFromPrivateKeyBytes,
  getAddressDecoder,
  getBase58Decoder,
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
  const secretKey = getBase58Decoder().decode(secretKeyRaw);

  log.info("Public Key (bs58): %s", keypair.address);
  log.info("Secret Key (phantom): %s", secretKey);
  log.info("Private Key (bs58): %s", privateKey);
  log.info("Secret key (uint8[]): [%s]", Array.from(uint8Array));
} else {
  const secretKeyBytes = getBase58Encoder().encode(raw);
  const secretKeyBs58 = getBase58Decoder().decode(secretKeyBytes);
  const privateKeyBytes = secretKeyBytes.slice(0, 32);
  const keypair = await createKeyPairSignerFromPrivateKeyBytes(
    privateKeyBytes,
    true,
  );
  const privateKeyBs58 = getBase58Decoder().decode(privateKeyBytes);

  log.info("Public Key (bs58): %s", keypair.address);
  log.info("Secret Key (phantom): %s", secretKeyBs58);
  log.info("Private Key (bs58): %s", privateKeyBs58);
  log.info("Secret Key (uint8[]): [%s]", Array.from(secretKeyBytes));
}
