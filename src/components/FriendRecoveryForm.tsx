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
  Text,
} from "@chakra-ui/react";
import { signRecoveryMessage } from "../sdk/signRecoveryMessage";
import { useSigner } from "wagmi";

export function FriendRecoveryForm() {
  const [oldAddress, setOldAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: signer } = useSigner();

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
    const message2 = await sendSignatureToAddress(newAddress, message);
    setIsSending(false);
  }

  return (
    <VStack spacing={8}>
      <HStack spacing={5}>
        <Text fontSize="xl" mr={4}>
          {" "}
          Old Address:{" "}
        </Text>
        <FormControl isInvalid={false}>
          <Input
            variant="filled"
            placeholder={constants.AddressZero}
            onChange={(e) => setOldAddress(e.target.value)}
          />
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
      </HStack>

      <HStack>
        <Text fontSize="xl" mr={4}>
          {" "}
          New Address:{" "}
        </Text>
        <FormControl isInvalid={false}>
          <Input
            variant="filled"
            placeholder={constants.AddressZero}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
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
