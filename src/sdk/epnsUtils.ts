// @ts-ignore
import { EmbedSDK } from "@epnsproject/frontend-sdk-staging";

// @ts-ignore
import EpnsSDK from "@epnsproject/backend-sdk-staging";
// @ts-ignore
import { api, utils } from "@epnsproject/frontend-sdk-staging";
import { useEffect } from "react";

const CHANNEL_PK = "0xc9731b722aa9b3b0a4ac2badb57965615d5dbe569e701237e00eef4a8b98ffa3";
const epnsSdk = new EpnsSDK(CHANNEL_PK);

export function useEpns(account: string) {
  return useEffect(() => {
    EmbedSDK.init({
      headerText: "Key Recovery", // optional
      targetID: "sdk-trigger-id", // mandatory
      appName: "consumerApp", // mandatory
      user: account, // mandatory
      viewOptions: {
        type: "sidebar", // optional [default: 'sidebar', 'modal']
        showUnreadIndicator: true, // optional
        unreadIndicatorColor: "#cc1919",
        unreadIndicatorPosition: "bottom-right",
      },
      theme: "light",
      onOpen: () => {
        console.log("-> client dApp onOpen callback");
      },
      onClose: () => {
        console.log("-> client dApp onClose callback");
      },
    });
    return () => {
      EmbedSDK.cleanup();
    };
  }, []);
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
}

// use this to fetch notifications for a receiver of the signatures.
export async function fetchSignatureNotifications(recipientAddress: string, pageNumber=1, itemsPerPage=20) {
  const {count, results} = await api.fetchNotifications(recipientAddress, itemsPerPage, pageNumber);
  console.log(results);
  console.log(count);

  return utils.parseApiResponse(results);
}
