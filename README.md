This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Long Description

Keyko combines smart contracts, threshold cryptography, decentralized storage, and trusted parties to securely store and recover private keys.

Users begin by designating a number of trusted addresses as guardians, which will help with key recovery should it be necessary. Keyko then locally encrypts their private key, sets up a decentralized access control schema, and uploads the digest to IPFS.

In the future, should a user lose their private key, they can simply log in with a fresh wallet and recover it with the help (and signatures) of their guardians. Keyko streamlines the process of collecting and submitting the signatures by using EPNS as a communication layer between the trusted parties. Once the signatures have been collected, the lost private key can be decrypted and displayed for the user a single time. Voila, the private key has been recovered.

When acting as a guardian, users are able to submit signatures to help recover a friend’s private key through our interface as well.

Since users can delegate anyone as a guardian, Keyko provides a solution for everyone without the need for a smart contract wallet. Here are a few examples:
- Users with multiple ledgers can create a dependency network between the wallets to protect their own funds
- Users can set relatives as guardians to protect their estate
- Users can delegate trusted organizations as part of their set of guardians for additional security
- And of course, you can fill your guardian network with some close friends


## How it's Made

Our frontend is built with React, Next.js, and Typescript. We integrate WalletConnect to provide a seamless login experience for a wide range of users. Our interface for registering and uploading your trusted guardians is also optimized to allow for addressing by both public key and ENS domain for greater convenience.

Our infrastructure consists of six core elements:
- Conditional, decentralized access control using Lit Protocol
- Decentralized storage using IPFS
- Communication channels between guardians and recoverers using EPNS
- Indexing using Privy
- Smart contracts that handle signature verification and approval of recoverers
- (in progress) Proof of Sameness using WorldCoin’s WorldID.

Keyko leverages the decentralized storage and access control mechanism which makes storing private keys secure. Once a user encrypts their private key, the symmetric key used to encrypt the private key is encrypted. Both the encrypted private key and encrypted symmetric key are stored on IPFS. We then create the access control condition using Lit Protocol, which leverages threshold cryptography over a series of nodes so that no single node has access to our data. Each node verifies that the condition for decryption (a signed message from each guardian) is met before submitting a share of the symmetric key, making it impossible to reconstruct until a certain fraction of nodes make their contribution. Once the condition is met, the encrypted symmetric key, stored on IPFS, can be decrypted after being accessed using our indexing protocol on Privy. That decrypted key can then be used locally to recover the original secret.

To streamline this process, signatures are sent to the recoverer through an EPNS channel using targeted notifications. Once the guardian signatures have been collected all the recoverer needs to do is click a button to access their previously lost key.

Another noteworthy aspect of our protocol is Proof of Sameness, a twist on WorldID’s Proof of Uniqueness, which verifies that the human requesting private key recovery is in fact the same human that performed the initial back up - without knowing their identity. While WorldID is designed to prevent a single human from interacting with a protocol multiple times across different accounts, we morphed this paradigm by only allowing users with the same WorldID account but a different address to request private key recovery. We do this by creating a new action for each new user, with an actionID involving each of their guardians and original public key, and then immediately interacting with the contract using the original user’s wallet. This saves their nullifier hash (a unique identifier for any human in the scope of a given action) to the state, which we then use as prerequisite for future contract interactions instead of a barrier.

Big ups to the sponsors and organizers that helped us out this weekend, we couldn't have built this without your support.
