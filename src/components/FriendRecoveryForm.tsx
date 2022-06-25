import {useState} from "react";
import {getUserNonce} from "../sdk/getUserNonce";
import {sendSignatureToAddress} from "../sdk/epnsUtils";
import { constants } from "ethers";

import {
    Box,
    HStack,
    VStack,
    FormControl,
    Input,
    FormErrorMessage,
    Button,
    Text
} from "@chakra-ui/react";
import { signRecoveryMessage } from "../sdk/signRecoveryMessage";
import {useSigner} from "wagmi";

export function FriendRecoveryForm() {
    const [oldAddress, setOldAddress] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [isSending, setIsSending] = useState(false);

    const {data: signer} = useSigner();

    async function onSendSignClick(oldAddress:string, newAddress:string) {
        setIsSending(true);
        // plug in SDK
        const nonce = await getUserNonce(signer!, oldAddress);
        const message = await signRecoveryMessage(signer!, oldAddress, newAddress, nonce);
        const message2 = await sendSignatureToAddress(newAddress, message);
        setIsSending(false);
    }

    return (
            <VStack spacing={8}>

                <HStack spacing={5}>
                    <Text fontSize='xl' mr={4}> Old Address: </Text>
                    <FormControl isInvalid={false}>
                        <Input
                            variant="filled"
                            placeholder={constants.AddressZero}
                            onChange={e => setOldAddress(e.target.value)}
                        />
                        <FormErrorMessage></FormErrorMessage>
                    </FormControl>
                </HStack>

                <HStack>
                <Text fontSize='xl' mr={4}> New Address: </Text>
                <FormControl isInvalid={false}>
                    <Input
                        variant="filled"
                        placeholder={constants.AddressZero}
                        onChange={e => setNewAddress(e.target.value)}
                    />
                    <FormErrorMessage></FormErrorMessage>
                </FormControl>
            </HStack>

                <Button onClick={()=>onSendSignClick(oldAddress, newAddress)} isLoading={isSending}>Sign and Send</Button>


            </VStack>

            // {/*<Flex direction="column" background="gray.500" justifyContent="center" p={12} rounded={14}>*/}
            // {/*    <Heading size="2xl" mb={12} >Friend Recovery</Heading>*/}
            // {/*    <SimpleGrid columns={2} columnGap={3} rowGap={6} w='full' mb={10}>*/}
            // {/*        <GridItem colSpan={1}>*/}
            // {/*            <Text fontSize='xl' mr={4} >Friend's Old Address:</Text>*/}
            // {/*        </GridItem>*/}
            // {/*        <GridItem colSpan={1}>*/}
            // {/*            <Input id='oldAddress' onChange={a => setOldAddress(a.target.value)} variant='outline' placeholder={constants.AddressZero}/>*/}
            // {/*        </GridItem>*/}
            // {/*        <GridItem colSpan={1}>*/}
            // {/*            <Text fontSize='xl' mr={4} >Friend's New Address:</Text>*/}
            // {/*        </GridItem>*/}
            // {/*        <GridItem colSpan={1}>*/}
            // {/*            <Input id='newAddress' onChange={a => setNewAddress(a.target.value)} variant='outline' placeholder={constants.AddressZero}/>*/}
            // {/*        </GridItem>*/}
            // {/*    </SimpleGrid>*/}
            // {/*    <Button onClick={()=>onSendSignClick(oldAddress, newAddress)} isLoading={isSending}>Sign and Send</Button>*/}
            //
            // {/*</Flex>*/}
    );
}
