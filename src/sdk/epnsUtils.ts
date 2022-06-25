import EpnsSDK from "@epnsproject/backend-sdk-staging";
import { api, utils } from "@epnsproject/frontend-sdk";

const CHANNEL_PK = "c9731b722aa9b3b0a4ac2badb57965615d5dbe569e701237e00eef4a8b98ffa3";

const  epnsSdk = new EpnsSDK(CHANNEL_PK);

// use this to send a notification containing a signature to your friend who lost their wallet.
// recipientAddress should be the address of the wallet created to recover the key.
export async function sendSignatureToAddress(recipientAddress: string, signature: string): Promise<any> {
  const tx = await epnsSdk.sendNotification(
    recipient,
    "Signature",
    signature,
    "Signature",
    signature,
    3,
    null,
    null,
    null
  );
}

// use this to fetch notifications for a receiver of the signatures.
export async function fetchSignatureNotifications(recipientAddress: string, pageNumber: number, itemsPerPage: number) {
  const {count, results} = await api.fetchNotifications(recipientAddress, itemsPerPage, pageNumber);
  return utils.parseApiResponse(results);
}