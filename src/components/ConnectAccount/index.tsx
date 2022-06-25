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
import ConnectorModal from "./ConnectorModal";
import AccountModal from "./AccountModal";
import { ethers } from "ethers";

export default function ConnectAccount() {
  const {
    isOpen: isAccountModalOpen,
    onOpen: onAccountModalOpen,
    onClose: onAccountModalClose,
  } = useDisclosure();
  const {
    isOpen: isConnectorModalOpen,
    onOpen: onConnectorModalOpen,
    onClose: onConnectorModalClose,
  } = useDisclosure();

  const { isConnected } = useConnect();

  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({ address: account?.address });

  const { data: balance } = useBalance({ addressOrName: account?.address });

  const hoverBg = useColorModeValue("gray.300", "gray.700");
  const balanceBg = useColorModeValue("gray.100", "gray.700");
  const addressBg = useColorModeValue("gray.200", "gray.800");
  const buttonBg = useColorModeValue("blue.200", "blue.500");

  const address = account?.address
    ? account.address
    : ethers.constants.AddressZero;
  const displayAddress = ensName ? ensName : formatAddress(address);

  function closeModals() {
    onAccountModalClose();
    onConnectorModalClose();
  }

  function formatAddress(address: string) {
    return (
      address.slice(0, 6) +
      `...` +
      address.slice(address.length - 4, address.length)
    );
  }

  if (isConnected) {
    return (
      <>
        <Box
          display="flex"
          alignItems="center"
          background={balanceBg}
          borderRadius="xl"
          py="0"
        >
          <Box px="3">
            <Text fontSize="md">
              {balance?.value &&
                parseFloat(formatEther(balance?.value)).toFixed(3)}{" "}
              ETH
            </Text>
          </Box>
          <Button
            onClick={onAccountModalOpen}
            bg={addressBg}
            border="1px solid transparent"
            _hover={{
              border: "1px",
              borderStyle: "solid",
              borderColor: hoverBg,
              backgroundColor: hoverBg,
            }}
            borderRadius="xl"
            m="1px"
            px={3}
            height="38px"
          >
            <Text fontSize="md" fontWeight="medium" mr="2">
              {displayAddress}
            </Text>
          </Button>
        </Box>
        <AccountModal
          isOpen={isAccountModalOpen}
          onClose={closeModals}
          displayAddress={displayAddress}
        />
      </>
    );
  }

  return (
    <>
      <Button bg={buttonBg} borderRadius="2xl" onClick={onConnectorModalOpen}>
        Connect
      </Button>
      <ConnectorModal isOpen={isConnectorModalOpen} onClose={closeModals} />
    </>
  );
}
