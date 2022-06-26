import {Box, Button, GridItem, Heading, SimpleGrid, Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription, CloseButton, useDisclosure} from "@chakra-ui/react";
import {NotificationList} from "../NotificationList";
import {AddressInput} from "../AddressInput";
import {RecoverySuccessModal} from "../RecoverySuccessModal";
import {useState} from "react";
import {recoverKey} from "../../sdk/recoveryKey";
import {ethers, Signer} from "ethers";
import {PrivyClient} from "@privy-io/privy-browser";
import {useAccount, useSigner} from "wagmi";
import {usePrivySession} from "../PrivySession";


export function PersonalRecovery() {
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
            const plaintextKey = await recoverKey(oldAddress, account!.address!, signer!, privySession.privy);
            setRecoveredKey(plaintextKey!);
            setIsRecovering(true);
            onRecoverySuccessModalOpen();
        } catch (e) {
            onRecoveryFailureAlertOpen();
        }
    }


    return (<>
        {isRecoveryFailureAlertOpen &&
            <Alert status='error' variant='top-accent'>
                <AlertIcon />
                <AlertTitle>Error Retrieving your Private Key</AlertTitle>
                <AlertDescription>You may not have acquired enough signatures</AlertDescription>
                <CloseButton
                    alignSelf='flex-start'
                    position='relative'
                    right={-1}
                    top={1}
                    onClick={onCloseFailureAlert}
                />
            </Alert>}
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
                    fontSize="4xl"
                    mb={6}
                    justifyItems="center"
                    justifySelf="center"
                >
                    Personal Key Recovery
                </Heading>
                <GridItem p={6} justifyItems="center">
                    <NotificationList />
                </GridItem>
                <GridItem justifyItems="center" mb={4} w="full">
                    <AddressInput inputValue={oldAddress} onChange={setOldAddress} />
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

    </>);
}
