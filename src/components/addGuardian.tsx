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

type ConnectorModalProps = {
    isOpen: any;
    onClose: any;
  };



export default function AddGuardianModal({
    isOpen,
    onClose,
  }: ConnectorModalProps) {

    const bg = useColorModeValue("white", "gray.800");
    const buttonBg = useColorModeValue("blue.200", "blue.500");

  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" width="md">
          <ModalHeader>Confirm Add Guardian</ModalHeader>
  
          <ModalBody>
                <Button
                  w="full"
                  borderRadius="full"
                  bgColor={buttonBg}
                //   disabled={!connector.ready}
                //   key={connector.id}
                  onClick={() => null}
                >
                </Button>
          </ModalBody>
  
          <ModalFooter>
            {/* {connectError && (
              <Box alignItems="start" pos="absolute" pl={4} left={1}>
                {connectError?.message ?? "Failed to connect"}
              </Box>
            )} */}
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
  