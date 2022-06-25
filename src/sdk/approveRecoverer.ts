import { Contract, Signer, TransactionResponse } from "ethers";

import { KEYKOVERY_CONTRACT_ADDRESS } from "./constants";
import KEYKOVERY_ABI from "./abis/Keycovery.json";

export async function approveRecoverer(
  signer: Signer,
  lostWalletAddress: string,
  newWalletAddress: string,
  friendSignatures: Array<string>
): Promise<TransactionResponse> {
  let contract = new Contract(
    KEYKOVERY_CONTRACT_ADDRESS,
    KEYKOVERY_ABI,
    signer
  );
  return await contract.approveRecoverer(
    lostWalletAddress,
    newWalletAddress,
    friendSignatures
  );
}
