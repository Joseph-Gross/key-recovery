import LitJsSdk from "lit-js-sdk/build/index.node.js";

export const litNodeClient = new LitJsSdk.LitNodeClient({
  alertWhenUnauthorized: false,
});

export async function getAuthSig(chain): Promise<any> {
  var authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain: chain,
  });
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
  authSig: any,
  chain: string
): Promise<Uint8Array> {
  // Returns the symmetric key that has been encrypted with the Lit network public key.
  return await litNodeClient.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig,
    chain,
  });
}

export async function getEncryptionKey(
  accessControlConditions: any,
  encryptedSymmetricKey: Uint8Array,
  authSig: any,
  chain: string
): Promise<Uint8Array> {
  return await litNodeClient.getEncryptionKey({
    accessControlConditions,
    authSig,
    toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
    chain,
  });
}

export function generateAccessControlConditions(
  keycoveryContractAddress: string,
  lostWalletAddress: string,
  chain: string
) {
  return [
    {
      conditionType: "evmContract",
      contractAddress: keycoveryContractAddress,
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
        name: "verify",
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
      chain,
      returnValueTest: {
        comparator: "=",
        value: "true",
      },
    },
  ];
}
