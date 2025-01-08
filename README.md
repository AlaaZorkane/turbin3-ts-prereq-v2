<img src="https://turbin3.com/turbine-logo-text.svg" alt="Turbin3" width="200">

**Turbin3 Typescript Prereq made with `@solana/web3.js v2`!**

## What is this? We asked for an anchor version!
Yes you did, you can find the anchor version, as specified in the prereq document [here](https://github.com/AlaaZorkane/turbin-ts-prereq).

But this is what you might call, a _bleeding edge version_ - it uses the new `@solana/web3.js` v2, and the new `codama` v2 generated client.

## Why?
I finished the original prereq and I was looking for something to learn, I already built the pinocchio challenge with the new web3.js v2 but never used codama to generate the client from an IDL, so seemed like a good opportunity to learn!

## How is this different from the anchor version?
Functionality-wise, it's the exact same. (except maybe using versioned transactions).

Code-wise though, it's a bit different:
- It uses the new `@solana/web3.js` v2, and the new `codama` v2 generated client.
- It uses the new functional style of the `@solana/web3.js` v2 to build transaction messages.
- It uses the new `codama` v2 generated client to build the transaction message and sign it with the `dev-wallet.json`.

## Structure
- `phantom.ts`: Phantom key converter, helps you convert from/to base58 encoded secret keys, `prompt-sync` is wonky though.
- `utils/`: Utility functions
- `keygen.ts`: Keygen, simple script to generate a `dev-wallet.json`, it doesn't overwrite the file if it already exists
- `airdrop.ts`: Airdrop, simple script to airdrop SOL to your `dev-wallet.json`
- `transfer.ts`: The transfer script, it uses the `dev-wallet.json` to transfer SOL to the specified address and later to drain the wallet to turbin3's address, shows the use of the new functional style of the `@solana/web3.js` v2 to build transaction messages.
- `enroll.ts`: Uses codama's v2 generated client to build the transaction message and sign it with the `dev-wallet.json`

### Setup

- Make sure you have `bun` installed
- If not run this:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Keygen

```bash
bun keygen
```

To export the file into a `dev-wallet.json`:

```bash
bun keygen:export
```

### Airdrop

```bash
bun airdrop
```

### Transfer

CAUTION: this drains the wallet, so maybe call `enroll` first to prevent airdrop 429.

```bash
bun transfer
```

### Enroll

You need to have a `dev-wallet.json` file in the root of the project.

```bash
bun enroll
```
