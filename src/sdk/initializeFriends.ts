import {Contract, Signer, Transaction} from "ethers";

import {KEYKOVERY_CONTRACT_ADDRESS} from "./constants";
import KEYKOVERY_ABI from "./abis/Keycovery.json";

export async function initializeFriends(signer: Signer, friendAddresses: Array<string>, friendLabels: Array<string>): Promise<Transaction> {
  let contract = new Contract(KEYKOVERY_CONTRACT_ADDRESS, KEYKOVERY_ABI, signer);
  return await contract.initializeWalletFriends(friendAddresses);
}

