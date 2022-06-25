import { Contract, Signer, Result } from "ethers";

import { KEYKOVERY_CONTRACT_ADDRESS } from "./constants";
import KEYKOVERY_ABI from "./abis/Keycovery.json";

export async function approveRecoverer(signer: Signer, lostWalletAddress: string, newWalletAddress: string, friendSignatures: Array<string>): Promise<Result> {
  let contract = new Contract(KEYKOVERY_CONTRACT_ADDRESS, KEYKOVERY_ABI, signer);
  let tx = await contract.approveRecoverer(lostWalletAddress, newWalletAddress, friendSignatures);
  return tx;
}