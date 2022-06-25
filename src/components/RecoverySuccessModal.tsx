import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text, VStack, useClipboard
} from '@chakra-ui/react'
import {CheckIcon, CopyIcon} from "@chakra-ui/icons";

export interface RecoverySuccessModalProps {
    privateKey: string;
    isOpen: boolean;
    onClose: () => any;
}

export function RecoverySuccessModal({privateKey, isOpen, onClose}: RecoverySuccessModalProps) {

    const { hasCopied, onCopy } = useClipboard(privateKey);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Private Key Recovery Successful</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5} align='center'>
                        <Text fontSize='lg'> Your private key recovery was successful! This key will only be displayed.
                        Copy it to your clipboard and do not share with anyone. Once you exit this modal, you will have
                        to repeat the recovery process to get your private key again. </Text>
                        <Text fontSize='md'> {privateKey} </Text>
                        {hasCopied ? (
                            <Text
                                variant="link"
                                fontWeight="normal"
                                fontSize="sm"
                                _hover={{
                                    textDecoration: "none",
                                    color: "whiteAlpha.800",
                                }}
                            >
                                <CheckIcon mr={1} />
                                Copied to clipboard
                            </Text>
                        ) : (
                            <Button
                                variant="link"
                                fontWeight="normal"
                                fontSize="sm"
                                _hover={{
                                    textDecoration: "none",
                                    color: "whiteAlpha.800",
                                }}
                                onClick={onCopy}
                            >
                                Copy Private Key
                                <CopyIcon mr={1} />
                            </Button>
                        )}
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
