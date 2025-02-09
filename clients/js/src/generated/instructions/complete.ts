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
  combineCodec,
  fixDecoderSize,
  fixEncoderSize,
  getAddressEncoder,
  getBytesDecoder,
  getBytesEncoder,
  getProgramDerivedAddress,
  getStructDecoder,
  getStructEncoder,
  getU32Decoder,
  getU32Encoder,
  transformEncoder,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
  type IAccountMeta,
  type IAccountSignerMeta,
  type IInstruction,
  type IInstructionWithAccounts,
  type IInstructionWithData,
  type ReadonlyAccount,
  type ReadonlyUint8Array,
  type TransactionSigner,
  type WritableAccount,
  type WritableSignerAccount,
} from '@solana/web3.js';
import { WBA_PREREQ_PROGRAM_ADDRESS } from '../programs';
import {
  expectAddress,
  getAccountMetaFactory,
  type ResolvedAccount,
} from '../shared';

export const COMPLETE_DISCRIMINATOR = new Uint8Array([
  0, 77, 224, 147, 136, 25, 88, 76,
]);

export function getCompleteDiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(COMPLETE_DISCRIMINATOR);
}

export type CompleteInstruction<
  TProgram extends string = typeof WBA_PREREQ_PROGRAM_ADDRESS,
  TAccountSigner extends string | IAccountMeta<string> = string,
  TAccountPrereq extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountSigner extends string
        ? WritableSignerAccount<TAccountSigner> &
            IAccountSignerMeta<TAccountSigner>
        : TAccountSigner,
      TAccountPrereq extends string
        ? WritableAccount<TAccountPrereq>
        : TAccountPrereq,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      ...TRemainingAccounts,
    ]
  >;

export type CompleteInstructionData = {
  discriminator: ReadonlyUint8Array;
  github: ReadonlyUint8Array;
};

export type CompleteInstructionDataArgs = { github: ReadonlyUint8Array };

export function getCompleteInstructionDataEncoder(): Encoder<CompleteInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([
      ['discriminator', fixEncoderSize(getBytesEncoder(), 8)],
      ['github', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
    ]),
    (value) => ({ ...value, discriminator: COMPLETE_DISCRIMINATOR })
  );
}

export function getCompleteInstructionDataDecoder(): Decoder<CompleteInstructionData> {
  return getStructDecoder([
    ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
    ['github', addDecoderSizePrefix(getBytesDecoder(), getU32Decoder())],
  ]);
}

export function getCompleteInstructionDataCodec(): Codec<
  CompleteInstructionDataArgs,
  CompleteInstructionData
> {
  return combineCodec(
    getCompleteInstructionDataEncoder(),
    getCompleteInstructionDataDecoder()
  );
}

export type CompleteAsyncInput<
  TAccountSigner extends string = string,
  TAccountPrereq extends string = string,
  TAccountSystemProgram extends string = string,
> = {
  signer: TransactionSigner<TAccountSigner>;
  prereq?: Address<TAccountPrereq>;
  systemProgram?: Address<TAccountSystemProgram>;
  github: CompleteInstructionDataArgs['github'];
};

export async function getCompleteInstructionAsync<
  TAccountSigner extends string,
  TAccountPrereq extends string,
  TAccountSystemProgram extends string,
  TProgramAddress extends Address = typeof WBA_PREREQ_PROGRAM_ADDRESS,
>(
  input: CompleteAsyncInput<
    TAccountSigner,
    TAccountPrereq,
    TAccountSystemProgram
  >,
  config?: { programAddress?: TProgramAddress }
): Promise<
  CompleteInstruction<
    TProgramAddress,
    TAccountSigner,
    TAccountPrereq,
    TAccountSystemProgram
  >
> {
  // Program address.
  const programAddress = config?.programAddress ?? WBA_PREREQ_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    signer: { value: input.signer ?? null, isWritable: true },
    prereq: { value: input.prereq ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.prereq.value) {
    accounts.prereq.value = await getProgramDerivedAddress({
      programAddress,
      seeds: [
        getBytesEncoder().encode(
          new Uint8Array([112, 114, 101, 114, 101, 113])
        ),
        getAddressEncoder().encode(expectAddress(accounts.signer.value)),
      ],
    });
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
  }

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.signer),
      getAccountMeta(accounts.prereq),
      getAccountMeta(accounts.systemProgram),
    ],
    programAddress,
    data: getCompleteInstructionDataEncoder().encode(
      args as CompleteInstructionDataArgs
    ),
  } as CompleteInstruction<
    TProgramAddress,
    TAccountSigner,
    TAccountPrereq,
    TAccountSystemProgram
  >;

  return instruction;
}

export type CompleteInput<
  TAccountSigner extends string = string,
  TAccountPrereq extends string = string,
  TAccountSystemProgram extends string = string,
> = {
  signer: TransactionSigner<TAccountSigner>;
  prereq: Address<TAccountPrereq>;
  systemProgram?: Address<TAccountSystemProgram>;
  github: CompleteInstructionDataArgs['github'];
};

export function getCompleteInstruction<
  TAccountSigner extends string,
  TAccountPrereq extends string,
  TAccountSystemProgram extends string,
  TProgramAddress extends Address = typeof WBA_PREREQ_PROGRAM_ADDRESS,
>(
  input: CompleteInput<TAccountSigner, TAccountPrereq, TAccountSystemProgram>,
  config?: { programAddress?: TProgramAddress }
): CompleteInstruction<
  TProgramAddress,
  TAccountSigner,
  TAccountPrereq,
  TAccountSystemProgram
> {
  // Program address.
  const programAddress = config?.programAddress ?? WBA_PREREQ_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    signer: { value: input.signer ?? null, isWritable: true },
    prereq: { value: input.prereq ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
  }

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.signer),
      getAccountMeta(accounts.prereq),
      getAccountMeta(accounts.systemProgram),
    ],
    programAddress,
    data: getCompleteInstructionDataEncoder().encode(
      args as CompleteInstructionDataArgs
    ),
  } as CompleteInstruction<
    TProgramAddress,
    TAccountSigner,
    TAccountPrereq,
    TAccountSystemProgram
  >;

  return instruction;
}

export type ParsedCompleteInstruction<
  TProgram extends string = typeof WBA_PREREQ_PROGRAM_ADDRESS,
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    signer: TAccountMetas[0];
    prereq: TAccountMetas[1];
    systemProgram: TAccountMetas[2];
  };
  data: CompleteInstructionData;
};

export function parseCompleteInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedCompleteInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 3) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      signer: getNextAccount(),
      prereq: getNextAccount(),
      systemProgram: getNextAccount(),
    },
    data: getCompleteInstructionDataDecoder().decode(instruction.data),
  };
}
