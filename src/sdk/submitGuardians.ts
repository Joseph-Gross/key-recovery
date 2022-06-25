import { Contract, Signer } from "ethers";
import { KEYKOVERY_CONTRACT_ADDRESS } from "./constants";

import * as litUtils from "./litUtils";
import * as tatumUtils from "./tatumUtils";

import { PrivyClient } from "@privy-io/privy-browser";
// import {encryptString, generateAccessControlConditions, getAuthSig, litNodeClient, saveEncryptionKey} from "./litUtils";

export interface Guardian {
  address: string;
  label: string;
}

export async function submitGuardians(
  signer: Signer,
  contract: Contract,
  privateKey: string,
  guardians: Array<Guardian>,
  privyClient: PrivyClient
) {
  // console.log("Initializing account on Keykovery contract...")
  // const guardianAddresses = guardians.map((guardian) => guardian.address);
  // await contract.initializeWalletFriends(guardianAddresses);

  console.log("Connecting lit client...");
  await litUtils.litNodeClient.connect();
  console.log("Getting authSig...");
  let authSig = await litUtils.getAuthSig("mumbai");
  console.log("Encrypting...");
  let { encryptedString, symmetricKey } = await litUtils.encryptString(
    privateKey
  );

  let signerAddress = await signer.getAddress();

  let encryptedSymmetricKey = await litUtils.saveEncryptionKey(
    litUtils.generateAccessControlConditions(
      signerAddress,
      KEYKOVERY_CONTRACT_ADDRESS,
      "mumbai"
    ),
    symmetricKey,
    authSig,
    "mumbai"
  );

  const encryptedKeyCid = await tatumUtils.uploadToIPFS(encryptedSymmetricKey);
  const serializedGuardians = JSON.stringify(guardians);

  await privyClient.put(signerAddress, [
    { field: "encrypted-key-cid", value: encryptedKeyCid },
    { field: "authorized-guardians-json", value: serializedGuardians },
  ]);
}
