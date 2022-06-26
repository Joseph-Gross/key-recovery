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
  "0x98fd714662134bf74d74c011053d9e75542107293177bd134e484bb953703c4e";
const CHANNEL_ADDRESS = "0x9968dA46b46D03a59C562d73B0e1C7884d72f14a";

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
 * @param fromLabel
 * @param fromAddress
 */
export async function sendSignatureToAddress(
  recipientAddress: string,
  signature: string,
  fromLabel: string,
  fromAddress: string
): Promise<any> {
  const tx = await epnsSdk.sendNotification(
    recipientAddress,
    fromAddress,
    signature,
    fromLabel,
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
