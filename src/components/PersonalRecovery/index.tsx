import {Box, Button, GridItem, Heading, SimpleGrid, useDisclosure} from "@chakra-ui/react";
import {NotificationList} from "../NotificationList";
import {AddressInput} from "../AddressInput";
import {RecoverySuccessModal} from "../RecoverySuccessModal";
import {useState} from "react";


export function PersonalRecovery() {
    const [isRecovering, setIsRecovering] = useState<boolean>();
    const [oldAddress, setOldAddress] = useState("");

    const {
        isOpen: isRecoverySuccessModalOpen,
        onOpen: onRecoverySuccessModalOpen,
        onClose: onRecoverySuccessModalClose,
    } = useDisclosure();

    function onRecoverClick() {

        console.log("Attempting to Recover");
    }


    return (<>
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
                        onClick={() =>
                            onRecoverClick()
                        }
                        isLoading={isRecovering}
                    >
                        Recover Key
                    </Button>
                </GridItem>
            </SimpleGrid>
        </Box>
        <RecoverySuccessModal
            isOpen={isRecoverySuccessModalOpen}
            onClose={onRecoverySuccessModalClose}
            privateKey="Private Key"
        />
    </>);
}
