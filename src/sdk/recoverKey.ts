import {fetchSignatureNotifications} from "./epnsUtils";
import {getFriendCount} from "./getFriendCount";
import {getUserNonce} from "./getUserNonce";
import {approveRecoverer} from "./approveRecoverer";
import {fetchFromIPFS} from "./ipfsUtils";
import {decryptString, generateAccessControlConditions, getAuthSig, getEncryptionKey} from "./litUtils";
import {Signer} from "ethers";
import {PrivyClient} from "@privy-io/privy-browser";

export async function recoverKey(oldAddress: string, newAddress: string, signer: Signer, privyClient: PrivyClient) {
    let signatureNotifs = await fetchSignatureNotifications(newAddress);

    let friendCount = await getFriendCount(signer, oldAddress);
    let currentNonce = await getUserNonce(signer, oldAddress);

    console.log("Notifications: " + signatureNotifs);

    if (signatureNotifs.length % friendCount == 0) {
        if (currentNonce == signatureNotifs.length / friendCount - 1 || (friendCount == 1 && signatureNotifs.length > 0)) {
            console.log("Enough signatures received... getting most recent ones");
            let recentSigs = signatureNotifs.slice(0, friendCount);
            console.log(recentSigs);

            // approve recovery address
            let tx = await approveRecoverer(
                signer,
                oldAddress,
                newAddress,
                currentNonce,
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


            console.log("Getting Auth Sig");
            let authSig = await getAuthSig();

            console.log("Getting symmetric key");
            const symmetricKey = await getEncryptionKey(
                generateAccessControlConditions(oldAddress),
                encryptedSymmetricKey,
                authSig
            );

            // PLAINTEXT PRIVATE KEY
            console.log("Attempting to decrypt string");
            return await decryptString(
                new Blob([encryptedPrivateKey]),
                symmetricKey
            );
        }
    } else {
        throw Error("Decryption Failed: Not enough signatures");
    }
}