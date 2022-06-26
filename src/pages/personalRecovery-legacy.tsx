import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Signer, utils } from "ethers";
import worldID from "@worldcoin/id";
import { AddressInput } from "../components/AddressInput";
import {
  Box,
  Button,
  Center,
  Text,
  Heading,
  Stack,
  VStack,
  StackDivider,
  Grid,
  GridItem,
  SimpleGrid,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { NotificationList } from "../components/NotificationList";
import { approveRecoverer } from "../sdk/approveRecoverer";
import {
  fetchSignatureNotifications,
  isUserSubscribed,
  optIn,
  useEpns,
} from "../sdk/epnsUtils";
import { getFriendCount, getFriendCountMumbai } from "../sdk/getFriendCount";
import { getUserNonce, getUserNonceMumbai } from "../sdk/getUserNonce";
import { fetchFromIPFS } from "../sdk/tatumUtils";
import {
  stringToUint8Array,
  getEncryptionKey,
  decryptString,
  generateAccessControlConditions,
  getAuthSig,
} from "../sdk/litUtils";
import { KEYKOVERY_CONTRACT_ADDRESS } from "../sdk/constants";
import { PrivyClient } from "@privy-io/privy-browser";
import { useAccount, useSigner, useProvider } from "wagmi";
import { usePrivySession } from "../components/PrivySession";
import { RecoverySuccessModal } from "../components/RecoverySuccessModal";

const PersonalRecoveryLegacy: NextPage = () => {
  /*
  worldID.init("world-id-container", {
    enable_telemetry: true,
    action_id: "wid_staging_90a71492daca49652946f01ead1524de",
    signal: "VerifyHuman" // Should be address of recoverer
  });

  useEffect(() => {
    (async () => {
      try {
        const result = await worldID.enable();
        console.log("World ID verified successfully:", result);
      } catch (failure) {
        console.warn("World ID verification failed:", failure);
        // Re-activate here so your end user can try again
      }
    })();
  }, []);
  */

  const privySession = usePrivySession();
  const privyClient = privySession.privy;
  const [isRecovering, setIsRecovering] = useState(false);

  async function onRecoverClick(
    signer: Signer,
    currentAddress: string,
    lostAddress: string,
    privy: PrivyClient
  ) {
    setIsRecovering(true);
    console.log("Old: " + oldAddress + lostAddress);
    // plug in SDK
    let signatureNotifs = await fetchSignatureNotifications(currentAddress);
    console.log("Signatures fetched");

    let friendCount = await getFriendCountMumbai(lostAddress);
    console.log("Friend Count");

    let currentNonce = await getUserNonceMumbai(lostAddress);
    console.log("Current Nonce");

    console.log("Notifications: " + signatureNotifs);

    if (signatureNotifs.length % friendCount == 0) {
      if (currentNonce == signatureNotifs.length / friendCount - 1) {
        console.log("Enough signatures received... getting most recent ones");
        let recentSigs = signatureNotifs.slice(-friendCount);
        console.log(recentSigs);
        // approve recovery address
        console.log(lostAddress);
        console.log(currentAddress);
        console.log(currentNonce);
        console.log(recentSigs.map((notif: { message: string }) => notif.message));

        let hash = utils.keccak256(utils.defaultAbiCoder.encode(["address", "address", "uint256"], [lostAddress, currentAddress, currentNonce]));

        console.log("***RECOVERED****: " + utils.recoverAddress(hash, recentSigs[0].message));

        let tx = await approveRecoverer(
          signer,
          lostAddress,
          currentAddress,
          currentNonce,
          recentSigs.map((notif: { message: string }) => notif.message)
        );
        await tx.wait();

        const encryptedPrivateKeyCid = await privy.get(
          lostAddress,
          "encrypted-private-key-cid"
        );
        const encryptedSymmetricKeyCid = await privy.get(
          lostAddress,
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

        let encodedSymmetricKey;

        const symmetricKey = await getEncryptionKey(
          generateAccessControlConditions(lostAddress),
          encryptedSymmetricKey,
          authSig
        );

        // PLAINTEXT PRIVATE KEY
        let plaintextPrivateKey = await decryptString(
          new Blob([encryptedPrivateKey]),
          symmetricKey
        );

        console.log("GOT PK! " + plaintextPrivateKey);
      }
    } else {
      console.log("Not enough signatures");
      setIsRecovering(false);
    }
  }

  const [oldAddress, setOldAddress] = useState("");
  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  const currentAddress = account?.address;
  const provider = useProvider();

  // TODO: EPNS stuff below did not work - @Richter
  useEffect(() => {

     async function tryOptIn() {
       const isOptedIn = await isUserSubscribed(privySession.address);
       if (!isOptedIn && signer) {
         await optIn(signer!);
       }
       const signatureNotifs = await fetchSignatureNotifications(privySession.address);
       console.log(signatureNotifs);
     }
     tryOptIn().then(response => console.log("User subscribed"));
  }, [privySession, signer])

  const {
    isOpen: isRecoverySuccessModalOpen,
    onOpen: onRecoverySuccessModalOpen,
    onClose: onRecoverySuccessModalClose,
  } = useDisclosure();

  const address = account?.address
    ? account.address
    : "0x0fc26CE09E56594Aa364D0890ae43BDC14152e25";

  const [notifications, setNotifications] = useState<any[]>();

  useEffect(() => {
    console.log(address);
    fetchSignatureNotifications(address).then((_notifications) =>
      setNotifications(_notifications)
    );
  }, [address]);
  const numMessages = notifications?.length;

  // TO-DO: Set breakpoints for text
  if (notifications === undefined || notifications.length == 0) {
    return (
      <Box
        display={{ md: "flex" }}
        alignItems="center"
        justifyItems="center"
        minHeight="70vh"
        gap={8}
        mb={8}
        w="full"
      >
        <SimpleGrid
          columns={1}
          justifyItems="center"
          justifySelf="center"
          w="full"
        >
          <Heading fontSize="4xl" mb={12} justifyItems="center">
            Personal Key Recovery
          </Heading>
          <GridItem
            boxShadow="dark-lg"
            p={12}
            w="full"
            justifyItems="center"
            justifySelf="center"
          >
            <Center fontSize="3xl" justifyItems="center" w="full">
              No current messages.
            </Center>
          </GridItem>
        </SimpleGrid>
      </Box>
    );
  }
  // if there are ENS notifications
  return (
    <>
      {/* <Button onClick={onRecoverySuccessModalOpen}/> */}
      <Box
        display={{ md: "flex" }}
        alignItems="center"
        justifyItems="center"
        minHeight="70vh"
        gap={8}
        mb={8}
        w="full"
      >
        <SimpleGrid
          columns={1}
          justifyItems="center"
          justifySelf="center"
          w="full"
        >
          <Heading
            fontSize="4xl"
            mb={6}
            justifyItems="center"
            justifySelf="center"
          >
            Personal Key Recovery
          </Heading>
          <GridItem p={6} justifyItems="center">
            <NotificationList />
          </GridItem>
          <GridItem justifyItems="center" mb={4} w="full">
            <AddressInput inputValue={oldAddress} onChange={setOldAddress} label="Old Wallet Address" />
          </GridItem>
          <GridItem p={8}>
            <Button
              onClick={() =>
                onRecoverClick(
                  signer!,
                  currentAddress!,
                  oldAddress,
                  privyClient
                )
              }
              isLoading={isRecovering}
            >
              Recover Key
            </Button>
          </GridItem>
        </SimpleGrid>
      </Box>
      <RecoverySuccessModal
        isOpen={isRecoverySuccessModalOpen}
        onClose={onRecoverySuccessModalClose}
        privateKey="Private Key"
      />
    </>
  );
};

export default PersonalRecoveryLegacy;