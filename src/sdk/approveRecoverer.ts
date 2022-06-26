import { Contract, Signer, providers } from "ethers";

import { KEYKOVERY_CONTRACT_ADDRESS_KOVAN } from "./constants";
import KEYKOVERY_ABI from "./abis/Keycovery.json";

export async function approveRecoverer(
  signer: Signer,
  lostWalletAddress: string,
  newWalletAddress: string,
  nonce: number,
  friendSignatures: Array<string>
): Promise<providers.TransactionResponse> {
  let contract = new Contract(
    KEYKOVERY_CONTRACT_ADDRESS_KOVAN,
    KEYKOVERY_ABI,
    signer
  );
  return await contract.approveRecoverer(
    lostWalletAddress,
    newWalletAddress,
    nonce,
    friendSignatures
  );
}
