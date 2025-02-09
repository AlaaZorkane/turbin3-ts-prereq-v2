/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  addDecoderSizePrefix,
  addEncoderSizePrefix,
  assertAccountExists,
  assertAccountsExist,
  combineCodec,
  decodeAccount,
  fetchEncodedAccount,
  fetchEncodedAccounts,
  fixDecoderSize,
  fixEncoderSize,
  getAddressDecoder,
  getAddressEncoder,
  getBytesDecoder,
  getBytesEncoder,
  getStructDecoder,
  getStructEncoder,
  getU32Decoder,
  getU32Encoder,
  transformEncoder,
  type Account,
  type Address,
  type Codec,
  type Decoder,
  type EncodedAccount,
  type Encoder,
  type FetchAccountConfig,
  type FetchAccountsConfig,
  type MaybeAccount,
  type MaybeEncodedAccount,
  type ReadonlyUint8Array,
} from '@solana/web3.js';

export const Q2_PREREQ2024_DISCRIMINATOR = new Uint8Array([
  210, 203, 168, 103, 251, 233, 204, 6,
]);

export function getQ2Prereq2024DiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(
    Q2_PREREQ2024_DISCRIMINATOR
  );
}

export type Q2Prereq2024 = {
  discriminator: ReadonlyUint8Array;
  github: ReadonlyUint8Array;
  key: Address;
};

export type Q2Prereq2024Args = { github: ReadonlyUint8Array; key: Address };

export function getQ2Prereq2024Encoder(): Encoder<Q2Prereq2024Args> {
  return transformEncoder(
    getStructEncoder([
      ['discriminator', fixEncoderSize(getBytesEncoder(), 8)],
      ['github', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
      ['key', getAddressEncoder()],
    ]),
    (value) => ({ ...value, discriminator: Q2_PREREQ2024_DISCRIMINATOR })
  );
}

export function getQ2Prereq2024Decoder(): Decoder<Q2Prereq2024> {
  return getStructDecoder([
    ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
    ['github', addDecoderSizePrefix(getBytesDecoder(), getU32Decoder())],
    ['key', getAddressDecoder()],
  ]);
}

export function getQ2Prereq2024Codec(): Codec<Q2Prereq2024Args, Q2Prereq2024> {
  return combineCodec(getQ2Prereq2024Encoder(), getQ2Prereq2024Decoder());
}

export function decodeQ2Prereq2024<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress>
): Account<Q2Prereq2024, TAddress>;
export function decodeQ2Prereq2024<TAddress extends string = string>(
  encodedAccount: MaybeEncodedAccount<TAddress>
): MaybeAccount<Q2Prereq2024, TAddress>;
export function decodeQ2Prereq2024<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress> | MaybeEncodedAccount<TAddress>
): Account<Q2Prereq2024, TAddress> | MaybeAccount<Q2Prereq2024, TAddress> {
  return decodeAccount(
    encodedAccount as MaybeEncodedAccount<TAddress>,
    getQ2Prereq2024Decoder()
  );
}

export async function fetchQ2Prereq2024<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<Account<Q2Prereq2024, TAddress>> {
  const maybeAccount = await fetchMaybeQ2Prereq2024(rpc, address, config);
  assertAccountExists(maybeAccount);
  return maybeAccount;
}

export async function fetchMaybeQ2Prereq2024<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<MaybeAccount<Q2Prereq2024, TAddress>> {
  const maybeAccount = await fetchEncodedAccount(rpc, address, config);
  return decodeQ2Prereq2024(maybeAccount);
}

export async function fetchAllQ2Prereq2024(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<Account<Q2Prereq2024>[]> {
  const maybeAccounts = await fetchAllMaybeQ2Prereq2024(rpc, addresses, config);
  assertAccountsExist(maybeAccounts);
  return maybeAccounts;
}

export async function fetchAllMaybeQ2Prereq2024(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<MaybeAccount<Q2Prereq2024>[]> {
  const maybeAccounts = await fetchEncodedAccounts(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) => decodeQ2Prereq2024(maybeAccount));
}
