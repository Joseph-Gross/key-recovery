import { Contract, Signer } from "ethers";

import { KEYKOVERY_CONTRACT_ADDRESS } from "./constants";
import KEYKOVERY_ABI from "./abis/Keycovery.json";

export async function getUserNonce(signer: Signer, address: string): Promise<number> {
  let contract = new Contract(KEYKOVERY_CONTRACT_ADDRESS, KEYKOVERY_ABI, signer);
  return await contract.getRecoveryNonce(friendAddresses);
}

