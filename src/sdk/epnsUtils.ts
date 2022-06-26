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
  "0x4c03a3a734ecbdccce2d070065ac335a8d6b02b0a25cfb9217f7af850eb99e27";
const CHANNEL_ADDRESS = "0xA487417C3D40e41CF41B4887f9407bE3d1809428";

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
    "Signature received",
    signature,
    "Signature received",
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
