import { useState } from "react";
import { getUserNonceMumbai } from "../sdk/getUserNonce";
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
  Text,
} from "@chakra-ui/react";
import { signRecoveryMessage } from "../sdk/signRecoveryMessage";
import { useSigner } from "wagmi";
import { AddressInput } from "./AddressInput";

export function FriendRecoveryForm() {
  const [oldAddress, setOldAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: signer } = useSigner();

  async function onSendSignClick(oldAddress: string, newAddress: string) {
    setIsSending(true);
    // plug in SDK
    const nonce = await getUserNonceMumbai(oldAddress);
    const message = await signRecoveryMessage(
      signer!,
      oldAddress,
      newAddress,
      nonce
    );
    console.log(oldAddress)
    const message2 = await sendSignatureToAddress(newAddress, message);
    setIsSending(false);
  }

  return (
    <VStack spacing={8} w='full'>
      <HStack spacing={5} w='full'>
        <Text fontSize="xl" mr={4} w='full'>
          Lost Address:
        </Text>
        <AddressInput inputValue={oldAddress} onChange={setOldAddress} />
      </HStack>

      <HStack spacing={5} w='full'>
        <Text fontSize="xl" mr={4} w='full'>
          New Address:
        </Text>
        <AddressInput inputValue={newAddress} onChange={setNewAddress} />
      </HStack>

      <Button
        onClick={() => onSendSignClick(oldAddress, newAddress)}
        isLoading={isSending}
      >
        Sign and Send
      </Button>
    </VStack>
  );
}
