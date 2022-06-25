import React from "react";
import { Box, HStack, useColorModeValue } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from "@chakra-ui/react";

import { Connector, useConnect, useProvider } from "wagmi";
import { usePrivySession } from "../PrivySession";

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
  const privySession = usePrivySession();

  const bg = useColorModeValue("white", "gray.800");
  const buttonBg = useColorModeValue("blue.200", "blue.500");

  function handleConnectWallet(connector: Connector) {
    connect(connector);
    privySession
      .authenticate()
      .then((response) => console.log("Authentication Completed"));
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
                onClick={() => {
                  handleConnectWallet(connector);
                }}
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
