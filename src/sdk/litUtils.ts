// @ts-ignore
import * as LitJsSdk from "lit-js-sdk";
import { CHAIN_STRING, KEYKOVERY_CONTRACT_ADDRESS_KOVAN } from "./constants";

export const litNodeClient = new LitJsSdk.LitNodeClient({
  alertWhenUnauthorized: false,
});

export function stringToUint8Array(str: string): Uint8Array {
  let enc = new TextEncoder();
  return enc.encode(str);
}

export async function getAuthSig(): Promise<any> {
  const authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain: CHAIN_STRING,
  });
  return authSig;
}

export async function encryptString(s: string): Promise<any> {
  return await LitJsSdk.encryptString(s);
}

export async function decryptString(
  encryptedString: Blob,
  symmetricKey: Uint8Array
): Promise<string> {
  return await LitJsSdk.decryptString(encryptedString, symmetricKey);
}

export async function saveEncryptionKey(
  accessControlConditions: any,
  symmetricKey: Uint8Array,
  authSig: any
): Promise<Uint8Array> {
  // Returns the symmetric key that has been encrypted with the Lit network public key.
  return await litNodeClient.saveEncryptionKey({
    evmContractConditions: accessControlConditions,
    symmetricKey,
    authSig,
    chain: CHAIN_STRING,
  });
}

export async function getEncryptionKey(
  accessControlConditions: any,
  encryptedSymmetricKey: Uint8Array,
  authSig: any
): Promise<Uint8Array> {
  return await litNodeClient.getEncryptionKey({
    evmContractConditions: accessControlConditions,
    authSig,
    toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
    chain: CHAIN_STRING,
  });
}

export function generateAccessControlConditions(lostWalletAddress: string) {
  return [
    {
      conditionType: "evmContract",
      contractAddress: KEYKOVERY_CONTRACT_ADDRESS_KOVAN,
      functionName: "isAuthorizedRecoverer",
      functionParams: [lostWalletAddress, ":userAddress"],
      functionAbi: {
        inputs: [
          {
            internalType: "address",
            name: "lost",
            type: "address",
          },
          {
            internalType: "address",
            name: "recoverer",
            type: "address",
          },
        ],
        name: "isAuthorizedRecoverer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      chain: CHAIN_STRING,
      returnValueTest: {
        comparator: "=",
        value: "true",
      },
    },
  ];
}
