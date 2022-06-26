// @ts-ignore
import { EmbedSDK } from "@epnsproject/frontend-sdk-staging";
import { Signer } from "ethers";
import { KOVAN_CHAIN_ID } from "./constants";

// @ts-ignore
import EpnsSDK from "@epnsproject/backend-sdk-staging";
// @ts-ignore
import { api, utils, channels } from "@epnsproject/frontend-sdk-staging";
import { useEffect } from "react";

const CHANNEL_PK =
  "0xa39ce5641f5ee5e91517b17f73c77eddb82f057f27947fe29df968a859b38ac7";
const CHANNEL_ADDRESS = "0x8F1D478beAbFc1001abF46A24745503CE36ce867";

const epnsSdk = new EpnsSDK(CHANNEL_PK);


export async function isUserSubscribed(address: string): Promise<boolean> {
  return await channels.isUserSubscribed(address, CHANNEL_ADDRESS);
}

export async function optIn(signer: Signer) {
  let userAddress = await signer.getAddress();
  await channels.optIn(signer, CHANNEL_ADDRESS, KOVAN_CHAIN_ID, userAddress, {
    onSuccess: () => {
      console.log("opted in");
    },
  });
}

/**
 * use this to send a notification containing a signature to your friend who lost their wallet.
 * recipientAddress should be the address of the wallet created to recover the key.
 * @description Sends notification to a particular user
 * @param recipientAddress
 * @param signature
 */
export async function sendSignatureToAddress(
  recipientAddress: string,
  signature: string
): Promise<any> {
  const tx = await epnsSdk.sendNotification(
    recipientAddress,
    "Recover your account using this signature",
    signature,
    "Recover your account using this signature",
    signature,
    3,
    undefined,
    undefined,
    undefined
  );
  console.log(tx);
  return tx;
}

// use this to fetch notifications for a receiver of the signatures.
export async function fetchSignatureNotifications(
  recipientAddress: string,
  pageNumber = 1,
  itemsPerPage = 20
) {
  console.log(recipientAddress);
  const { count, results } = await api.fetchNotifications(
    recipientAddress,
    itemsPerPage,
    pageNumber
  );

  console.log(results);
  console.log(count);

  return utils.parseApiResponse(results);
}
