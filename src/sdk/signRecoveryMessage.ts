import { utils, Contract, Result, Signer } from "ethers";

import { KEYKOVERY_CONTRACT_ADDRESS } from "./constants";
import KEYKOVERY_ABI from "./abis/Keycovery.json";

export async function signRecoveryMessage(signer: Signer, friendLostAddress: string, friendNewAddress: string, nonce: number): Promise<string> {
  let encodedMessage = utils.defaultAbiCoder.encode(["address", "address", "uint256"], [friendLostAddress, friendNewAddress, nonce]);
  let hash = utils.keccak256(encodedMessage);
  let signature = await signer.signMessage(hash);
  return signature;
}

