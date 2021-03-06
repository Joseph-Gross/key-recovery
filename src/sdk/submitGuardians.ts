import { Contract, Signer } from "ethers";
import { KEYKOVERY_CONTRACT_ADDRESS_KOVAN } from "./constants";

import * as litUtils from "./litUtils";
import * as ipfsUtils from "./ipfsUtils";
import { initializeWalletGuardians } from "./initializeWalletGuardians";
import { CHAIN_STRING } from "./constants";

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

  let authSig = await litUtils.getAuthSig();

  console.log("Encrypting...");
  console.log(privateKey);

  let {
    encryptedString,
    symmetricKey,
  }: { encryptedString: Blob; symmetricKey: Uint8Array } =
    await litUtils.encryptString(privateKey);

  console.log("encpk:");
  console.log(encryptedString);
  console.log("symmmkey:");
  console.log(symmetricKey);

  let signerAddress = await signer.getAddress();

  console.log("initter: " + signerAddress);

  let encryptedSymmetricKey = await litUtils.saveEncryptionKey(
    litUtils.generateAccessControlConditions(signerAddress),
    symmetricKey,
    authSig
  );

  console.log("enc symmkey");
  console.log(encryptedSymmetricKey);

  const encryptedSymmetricKeyCid = await ipfsUtils.uploadUint8ArrayToIPFS(
    encryptedSymmetricKey
  );
  const encryptedPrivateKeyCid = await ipfsUtils.uploadBlobToIPFS(
    encryptedString
  );

  console.log("Encrypted Private Key CID: " + encryptedPrivateKeyCid);
  console.log("Encrypted Symmetric Key CID: " + encryptedSymmetricKeyCid);

  const serializedGuardians = JSON.stringify(guardians);
  console.log("Guardians: " + serializedGuardians);

  await privyClient.put(signerAddress, [
    { field: "encrypted-symmetric-key-cid", value: encryptedSymmetricKeyCid },
    { field: "encrypted-private-key-cid", value: encryptedPrivateKeyCid },
    { field: "authorized-guardians-json", value: serializedGuardians },
  ]);

  let tx = await initializeWalletGuardians(
    signer,
    guardians.map((guardian) => guardian.address)
  );
  await tx.wait();
}
