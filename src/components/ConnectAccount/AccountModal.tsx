import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import { useAccount, useDisconnect } from "wagmi";

type AccountModalProps = {
  displayAddress: string;
  isOpen: any;
  onClose: any;
};

export default function AccountModal({
  displayAddress,
  isOpen,
  onClose,
}: AccountModalProps) {
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();

  const bg = useColorModeValue("gray.200", "gray.800");
  const footerBg = useColorModeValue("gray.300", "gray.700");
  const textBg = useColorModeValue("gray.600", "gray.400");

  const hoverBg = useColorModeValue("gray.300", "gray.700");
  const balanceBg = useColorModeValue("gray.100", "gray.700");
  const addressBg = useColorModeValue("gray.200", "gray.800");
  const buttonBg = useColorModeValue("blue.200", "blue.500");

  function handleDeactivateAccount() {
    disconnect();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent
        background={bg}
        border="1px"
        borderStyle="solid"
        borderColor="gray.700"
        borderRadius="3xl"
      >
        <ModalHeader px={4} fontSize="lg" fontWeight="medium">
          Account
        </ModalHeader>
        <ModalCloseButton
          fontSize="sm"
          _hover={{
            color: "whiteAlpha.700",
          }}
        />
        <ModalBody pt={0} px={4}>
          <Box
            borderRadius="3xl"
            border="1px"
            borderStyle="solid"
            borderColor={textBg}
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text color={textBg} fontSize="sm">
                Connected with MetaMask
              </Text>
              <Button
                variant="outline"
                size="sm"
                borderColor="blue.800"
                borderRadius="3xl"
                color="blue.500"
                fontSize="13px"
                fontWeight="normal"
                px={2}
                height="26px"
                _hover={{
                  background: "none",
                  borderColor: "blue.300",
                  textDecoration: "underline",
                }}
                onClick={handleDeactivateAccount}
              >
                Disconnect
              </Button>
            </Flex>
            <Flex alignItems="center" mt={2} mb={4} lineHeight={1}>
              <Text fontSize="xl" fontWeight="semibold" ml="2" lineHeight="1.1">
                {displayAddress}
              </Text>
            </Flex>
            <Flex alignContent="center" m={3}>
              <Button
                variant="link"
                color={textBg}
                fontWeight="normal"
                fontSize="sm"
                _hover={{
                  textDecoration: "none",
                  color: "whiteAlpha.800",
                }}
              >
                <CopyIcon mr={1} />
                Copy Address
              </Button>
              <Link
                fontSize="sm"
                display="flex"
                alignItems="center"
                href={`https://ropsten.etherscan.io/address/${account}`}
                isExternal
                color={textBg}
                ml={6}
                _hover={{
                  color: "whiteAlpha.800",
                  textDecoration: "underline",
                }}
              >
                <ExternalLinkIcon mr={1} />
                View on Explorer
              </Link>
            </Flex>
          </Box>
        </ModalBody>

        <ModalFooter
          justifyContent="center"
          background={footerBg}
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={6}
        >
          <Text textAlign="center" fontWeight="medium" fontSize="md">
            Your transactions will appear here...
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
