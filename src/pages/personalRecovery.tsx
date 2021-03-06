import type { NextPage } from "next";
import {
  Box,
  Button,
  GridItem,
  Heading,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { NotificationTable} from "../components/NotificationTable";
import { AddressInput } from "../components/AddressInput";
import { RecoverySuccessModal } from "../components/RecoverySuccessModal";
import { useEffect, useState } from "react";
import { recoverKey } from "../sdk/recoverKey";
import { ethers, Signer } from "ethers";
import { useAccount, useSigner } from "wagmi";
import { usePrivySession } from "../components/PrivySession";
import { isUserSubscribed, optIn } from "../sdk/epnsUtils";

const PersonalRecovery: NextPage = () => {
  const [isRecovering, setIsRecovering] = useState<boolean>();
  const [oldAddress, setOldAddress] = useState("");
  const [recoveredKey, setRecoveredKey] = useState("");

  const privySession = usePrivySession();
  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  const {
    isOpen: isRecoverySuccessModalOpen,
    onOpen: onRecoverySuccessModalOpen,
    onClose: onRecoverySuccessModalClose,
  } = useDisclosure();

  const {
    isOpen: isRecoveryFailureAlertOpen,
    onOpen: onRecoveryFailureAlertOpen,
    onClose: onRecoveryFailureAlertClose,
  } = useDisclosure();

  function onCloseSuccessModal() {
    setRecoveredKey("");
    setIsRecovering(false);
    onRecoverySuccessModalClose();
  }

  function onCloseFailureAlert() {
    setOldAddress("");
    setIsRecovering(false);
    onRecoveryFailureAlertClose();
  }

  async function recover() {
    try {
      setIsRecovering(true);
      const plaintextKey = await recoverKey(
        oldAddress,
        account!.address!,
        signer!,
        privySession.privy
      );
      setRecoveredKey(plaintextKey!);
      setIsRecovering(true);
      onRecoverySuccessModalOpen();
    } catch (e) {
      console.log("Error: " + e);
      onRecoveryFailureAlertOpen();
    }
  }

  useEffect(() => {
    async function tryOptIn() {
      if (account?.address == undefined) {
        return;
      }

      const isOptedIn = await isUserSubscribed(account.address);
      if (!isOptedIn && signer) {
        await optIn(signer!);
      }
    }
    try {
      tryOptIn().then((response) => console.log("User subscribed to channel"));
    } catch (e) {
      console.log("User not signed in");
    }
  }, [privySession, signer]);

  return (
    <>
      {isRecoveryFailureAlertOpen && (
        <Alert status="error" variant="top-accent">
          <AlertIcon />
          <AlertTitle>Error Retrieving your Private Key</AlertTitle>
          <AlertDescription>
            You may not have acquired enough signatures
          </AlertDescription>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={1}
            onClick={onCloseFailureAlert}
          />
        </Alert>
      )}
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
              size="2xl"
            mb={6}
            justifyItems="center"
            justifySelf="center"
          >
            Personal Key Recovery
          </Heading>
          <Heading
              as='h5' size='sm'
              justifyItems="center"
              justifySelf="center"
          >
            Message Inbox
          </Heading>
          <GridItem p={6} justifyItems="center" w="xl-3">
            <NotificationTable />
          </GridItem>
          <GridItem justifyItems="center" mb={0} w="lg">
            <AddressInput
              inputValue={oldAddress}
              onChange={setOldAddress}
              label="Old Address"
            />
          </GridItem>
          <GridItem p={8}>
            <Button
              onClick={recover}
              isLoading={isRecovering}
              disabled={!ethers.utils.isAddress(oldAddress)}
            >
              Recover Key
            </Button>
          </GridItem>
        </SimpleGrid>
      </Box>
      <RecoverySuccessModal
        isOpen={isRecoverySuccessModalOpen}
        onClose={onCloseSuccessModal}
        privateKey={recoveredKey}
      />
    </>
  );
};

export default PersonalRecovery;
