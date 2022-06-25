import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Signer } from "ethers";
import worldID from "@worldcoin/id";
import { Box, Button, Text, Heading, Stack, VStack, StackDivider, Grid, GridItem, SimpleGrid } from "@chakra-ui/react";
import { NotificationList } from "../components/NotificationList";
import { approveRecoverer } from "../sdk/approveRecoverer";
import { fetchSignatureNotifications } from "../sdk/epnsUtils";
import { getFriendCount } from "../sdk/getFriendCount";
import { getUserNonce } from "../sdk/getUserNonce";
import { fetchFromIPFS } from "../sdk/tatumUtils";
import { getEncryptionKey, decryptString, generateAccessControlConditions, getAuthSig } from "../sdk/litUtils";
import { KEYKOVERY_CONTRACT_ADDRESS } from "../sdk/constants";

const PersonalRecovery: NextPage = () => {

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

  const [isRecovering, setIsRecovering] = useState(false);

  async function onRecoverClick(signer: Signer, currentAddress:string, lostAddress: string, privy: PrivyClient) {
    setIsRecovering(true);
    // plug in SDK
    let signatureNotifs = await fetchSignatureNotifications(currentAddress);
    let friendCount = await getFriendCount(signer, lostAddress);
    let currentNonce = await getUserNonce(signer, lostAddress);

    if (signatureNotifs.length % friendCount == 0) {
      if (currentNonce == (signatureNotifs.length / friendCount) - 1) {
        console.log("Enough signatures received... getting most recent ones");
        let recentSigs = signatureNotifs.slice(-friendCount);
        console.log(recentSigs);
        // approve recovery address
        let tx = await approveRecoverer(signer, lostAddress, currentAddress, recentSigs.map((notif) => notif.message));
        await tx.wait();
 
        const encryptedPrivateKeyCid = await privy.get(oldAddress, "encrypted-private-key-cid");
        const encryptedSymmetricKeyCid = await privy.get(oldAddress, "encrypted-symm-key-cid");

        const encryptedPrivateKey = await fetchFromIPFS(encryptedPrivateKeyCid);
        const encryptedSymmetricKey = await fetchFromIPFS(encryptedSymmetricKeyCid);

        console.log(encryptedKey);

        let authSig = await getAuthSig("mumbai");

        const symmetricKey = getEncryptionKey(
          generateAccessControlConditions(KEYKOVERY_CONTRACT_ADDRESS, lostAddress, "mumbai"),
          encryptedSymmetricKey,
          authSig,
          "mumbai"
        );

        // PLAINTEXT PRIVATE KEY
        let plaintextPrivateKey = await decryptString(encryptedPrivateKey, symmetricKey);

      }
    } else {
      console.log("Not enough signatures");
      setIsRecovering(false);
    }
  }

  // TO-DO: Set breakpoints for text
  return (
    <Box
        display={{ md: "flex" }}
        alignItems="center"
        minHeight="70vh"
        gap={8}
        mb={8}
        w="full"
        >
      <SimpleGrid columns={1} justifyItems='center'>
        <Heading fontSize='4xl' mb={4} >Personal Key Recovery</Heading>
        <Grid
          h='300px'
          w='full'
          templateRows='repeat(2, 1fr)'
          templateColumns='repeat(5, 1fr)'
          gap={4}
        >
          <GridItem rowSpan={2} colSpan={2} p={6} justifyItems='center'>
            <NotificationList/>
          </GridItem>
          <GridItem rowSpan={3} colSpan={3} p={10} justifyItems='center' justifySelf='center'>
            <Text fontSize='xl'  fontWeight={700}>
              Recover your lost key. Decryption will happen locally.
              </Text>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1} colStart={4} justifyItems='center' justifySelf='center'>
            <Button onClick={()=>onRecoverClick('currentAddress')} isLoading={isRecovering}>
              Recover Key
            </Button>
          </GridItem>
        </Grid>
      </SimpleGrid>
    </Box>
  );
};

export default PersonalRecovery;
