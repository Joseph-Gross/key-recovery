import { Contract, Signer, providers } from "ethers";

import { KEYKOVERY_CONTRACT_ADDRESS } from "./constants";
import KEYKOVERY_ABI from "./abis/Keycovery.json";
import { CHAIN_ID } from "./constants";

export async function getFriendCount(
  signer: Signer,
  address: string
): Promise<number> {
  let contract = new Contract(
    KEYKOVERY_CONTRACT_ADDRESS,
    KEYKOVERY_ABI,
    signer
  );
  return await contract.friendCount(address);
}

export async function getFriendCountMumbai(
  address: string
): Promise<number> {
  const provider = new providers.InfuraProvider(CHAIN_ID, "0f1f7a9c7a564aa7865fd681f7e3ba05");
  let contract = new Contract(
    KEYKOVERY_CONTRACT_ADDRESS,
    KEYKOVERY_ABI,
    provider
  );
  return await contract.friendCount(address);
}