import { Signer, utils } from "ethers";

export async function signRecoveryMessage(
  signer: Signer,
  friendLostAddress: string,
  friendNewAddress: string,
  nonce: number
): Promise<string> {
  let encodedMessage = utils.defaultAbiCoder.encode(
    ["address", "address", "uint256"],
    [friendLostAddress, friendNewAddress, nonce]
  );
  let hash = utils.keccak256(encodedMessage);
  return await signer.signMessage(utils.arrayify(hash));
}
