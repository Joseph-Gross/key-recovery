import { Contract, Result, Signer } from "ethers";

import { KEYKOVERY_CONTRACT_ADDRESS } from "./constants";
import KEYKOVERY_ABI from "./abis/Keycovery.json";

export async function initializeFriends(signer: Signer, friendAddresses: Array<string>, friendLabels: Array<string>): Promise<Result> {
  let contract = new Contract(KEYKOVERY_CONTRACT_ADDRESS, KEYKOVERY_ABI, signer);
  let tx = await contract.initializeWalletFriends(friendAddresses);
  return tx;
}

