import React from "react";
import {
  Box,
  HStack,
  useDisclosure,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from "@chakra-ui/react";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useBalance,
} from "wagmi";
import { formatEther } from "@ethersproject/units";

type ConnectorModalProps = {
  isOpen: any;
  onClose: any;
};

export default function ConnectorModal({
  isOpen,
  onClose,
}: ConnectorModalProps) {
  const {
    connect,
    connectors,
    error: connectError,
    isConnecting,
    pendingConnector,
  } = useConnect();

  const bg = useColorModeValue("white", "gray.800");
  const buttonBg = useColorModeValue("blue.200", "blue.500");

  function handleConnectWallet() {
    connect();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="2xl" width="md">
        <ModalHeader>Select Wallet</ModalHeader>

        <ModalBody>
          {connectors.map((connector) => (
            <HStack py={2} key={connector.id}>
              <Button
                w="full"
                borderRadius="full"
                bgColor={buttonBg}
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect(connector)}
              >
                {connector.name}
                {!connector.ready && " (unsupported)"}
                {isConnecting &&
                  connector.id === pendingConnector?.id &&
                  " (connecting)"}
              </Button>
            </HStack>
          ))}
        </ModalBody>

        <ModalFooter>
          {connectError && (
            <Box alignItems="start" pos="absolute" pl={4} left={1}>
              {connectError?.message ?? "Failed to connect"}
            </Box>
          )}
          <Button
            borderRadius="full"
            color="white"
            bg="red.400"
            mr={3}
            onClick={onClose}
          >
            CANCEL
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
