import { Contract, Signer, providers } from "ethers";

import { KEYKOVERY_CONTRACT_ADDRESS_KOVAN } from "./constants";
import KEYKOVERY_ABI from "./abis/Keycovery.json";

export async function getUserNonce(
  signer: Signer,
  address: string
): Promise<number> {
  let contract = new Contract(
    KEYKOVERY_CONTRACT_ADDRESS_KOVAN,
    KEYKOVERY_ABI,
    signer
  );
  return await contract.recoveryNonce(address);
}
/*
export async function getUserNonceMumbai(
  address: string
): Promise<number> {
  const provider = new providers.InfuraProvider(CHAIN_ID, "0f1f7a9c7a564aa7865fd681f7e3ba05");
  let contract = new Contract(
    KEYKOVERY_CONTRACT_ADDRESS,
    KEYKOVERY_ABI,
    provider
  );
  return await contract.recoveryNonce(address);
}
*/