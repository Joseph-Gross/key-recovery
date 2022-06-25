import { Signer } from "ethers";
import { KEYKOVERY_CONTRACT_ADDRESS } from "./constants";

import "./litUtils";
import "./privyUtils";
import "./tatumUtils";
import "./initializeFriends";

interface GuardianValues {
  address: string;
  label: string;
}

export async function submitGuardians(signer: Signer, pk: string, guardians: Array<GuardianValues>) {
  // Smart contract initialize friends
  // Lit protocol encryption + registration
  // Upload encrypted blob to IPFS
  // Privy kv store, (guardian labels, cids)

  console.log("Initializing account on Keykovery contract...")
  let tx = await initializeFriends(signer, guardians.map((guardian) => guardian.address));
  await tx.wait();
  console.log("Connecting lit client...");
  await litNodeClient.connect();
  console.log("Getting authSig...");
  let authSig = await getAuthSig("mumbai");
  console.log("Encrypting...")
  let { encryptedString, symmetricKey } = await encryptString(pk);

  let signerAddress = await signer.getAddress();

  let encryptedSymmetricKey = await saveEncryptionKey(
    generateAccessControlConditions(signerAddress, KEYKOVERY_CONTRACT_ADDRESS, "mumbai"),
    symmetricKey,
    authSig,
    "mumbai"
  );

  const encryptedKeyCid = await tatumUtils.uploadToIPFS(encryptedSymmetricKey);
  
  const serializedGuardians = JSON.stringify(guardians);

  await privySession.privy.put(privySession.address, [
      {field: 'encrypted-key-cid', value: encryptedKeyCid},
      {field: 'authorized-guardians-json', value: authorizedGuardiansJson},
    ]);
}