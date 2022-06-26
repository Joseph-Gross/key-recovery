import { Contract, Signer, providers } from "ethers";

import { KEYKOVERY_CONTRACT_ADDRESS_KOVAN } from "./constants";
import KEYKOVERY_ABI from "./abis/Keycovery.json";

export async function initializeWalletGuardians(
  signer: Signer,
  friendAddresses: Array<string>
): Promise<providers.TransactionResponse> {
  let contract = new Contract(
    KEYKOVERY_CONTRACT_ADDRESS_KOVAN,
    KEYKOVERY_ABI,
    signer
  );
  return await contract.initializeWalletFriends(friendAddresses);
}
