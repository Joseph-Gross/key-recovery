import { useState } from "react";
import { getUserNonce } from "../sdk/getUserNonce";
import { sendSignatureToAddress } from "../sdk/epnsUtils";
import { constants } from "ethers";

import {
  Box,
  HStack,
  VStack,
  FormControl,
  Input,
  FormErrorMessage,
  Button,
  Text, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, useDisclosure,
} from "@chakra-ui/react";
import { signRecoveryMessage } from "../sdk/signRecoveryMessage";
import { useSigner } from "wagmi";
import { AddressInput } from "./AddressInput";

export function FriendRecoveryForm() {
  const [fromLabel, setFromLabel] = useState("");
  const [oldAddress, setOldAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: signer } = useSigner();

  const {
    isOpen: isMessageAlertOpen,
    onOpen: onMessageAlertOpen,
    onClose: onMessageAlertClose,
  } = useDisclosure();

  async function onSendSignClick(oldAddress: string, newAddress: string) {
    setIsSending(true);
    // plug in SDK
    const nonce = await getUserNonce(signer!, oldAddress);
    const message = await signRecoveryMessage(
      signer!,
      oldAddress,
      newAddress,
      nonce
    );
    console.log(oldAddress);

    const signerAddress = await signer!.getAddress();
    await sendSignatureToAddress(newAddress, message, signerAddress, fromLabel);
    setIsSending(false);
    onMessageAlertOpen();
  }

  return (
      <>
        {isMessageAlertOpen && (
            <Alert status="success" variant="top-accent">
              <AlertIcon />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your message was successfully signed and sent to the right wallet and will be used in recovering a private key
              </AlertDescription>
              <CloseButton
                  alignSelf="flex-start"
                  position="relative"
                  right={-1}
                  top={1}
                  onClick={onMessageAlertClose}
              />
            </Alert>
        )}
    <VStack spacing={8} w="full">
      <HStack spacing={5} w="full">
        <Text fontSize="xl" mr={4} w="full">
          From:
        </Text>
        <Input
            variant="filled"
            value={fromLabel}
            onChange={(e) => setFromLabel(e.target.value)}
            placeholder="Attach your name to your message"
            size="md" minW="31rem"
        />
      </HStack>

      <HStack spacing={5} w="full">
        <Text fontSize="xl" mr={4} w="full">
          Lost Address:
        </Text>
        <AddressInput inputValue={oldAddress} onChange={setOldAddress} />
      </HStack>

      <HStack spacing={5} w="full">
        <Text fontSize="xl" mr={4} w="full">
          New Address:
        </Text>
        <AddressInput inputValue={newAddress} onChange={setNewAddress} />
      </HStack>

      <Button
        onClick={() => onSendSignClick(oldAddress, newAddress)}
        isLoading={isSending}
        disabled={fromLabel == undefined || fromLabel.length == 0}
      >
        Sign and Send
      </Button>
    </VStack>
      </>
  );
}
