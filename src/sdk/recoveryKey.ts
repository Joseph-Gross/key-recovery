import {fetchSignatureNotifications} from "./epnsUtils";
import {getFriendCountMumbai} from "./getFriendCount";
import {getUserNonceMumbai} from "./getUserNonce";
import {approveRecoverer} from "./approveRecoverer";
import {fetchFromIPFS} from "./ipfsUtils";
import {decryptString, generateAccessControlConditions, getAuthSig, getEncryptionKey} from "./litUtils";
import {Signer} from "ethers";
import {PrivyClient} from "@privy-io/privy-browser";

export async function recoverKey(oldAddress: string, newAddress: string, signer: Signer, privyClient: PrivyClient) {
    let signatureNotifs = await fetchSignatureNotifications(newAddress);

    let friendCount = await getFriendCountMumbai(oldAddress);
    let currentNonce = await getUserNonceMumbai(oldAddress);

    console.log("Notifications: " + signatureNotifs);

    if (signatureNotifs.length % friendCount == 0) {
        if (currentNonce == signatureNotifs.length / friendCount - 1) {
            console.log("Enough signatures received... getting most recent ones");
            let recentSigs = signatureNotifs.slice(-friendCount);
            console.log(recentSigs);
            // approve recovery address
            let tx = await approveRecoverer(
                signer,
                oldAddress,
                newAddress,
                recentSigs.map((notif: { message: string }) => notif.message)
            );
            await tx.wait();

            const encryptedPrivateKeyCid = await privyClient.get(
                oldAddress,
                "encrypted-private-key-cid"
            );
            const encryptedSymmetricKeyCid = await privyClient.get(
                oldAddress,
                "encrypted-symmetric-key-cid"
            );

            const encryptedPrivateKey = await fetchFromIPFS(
                encryptedPrivateKeyCid!.text()
            );
            const encryptedSymmetricKey = await fetchFromIPFS(
                encryptedSymmetricKeyCid!.text()
            );

            console.log(encryptedPrivateKey);
            console.log(encryptedSymmetricKey);

            let authSig = await getAuthSig();

            const symmetricKey = await getEncryptionKey(
                generateAccessControlConditions(oldAddress),
                encryptedSymmetricKey,
                authSig
            );

            // PLAINTEXT PRIVATE KEY
            return await decryptString(
                new Blob([encryptedPrivateKey]),
                symmetricKey
            );
        }
    } else {
        throw Error("Decryption Failed: Not enough signatures");
    }
}
