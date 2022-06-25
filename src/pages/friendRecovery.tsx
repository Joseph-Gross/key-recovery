import type { NextPage } from "next";
import { constants } from "ethers";
<<<<<<< HEAD
import { Box, Flex, Heading, Text, Grid, Button, useDisclosure, SimpleGrid, GridItem, FormControl, FormLabel, Input, IconButton, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { signRecoveryMessage } from "../sdk/signRecoveryMessage";
import { sendSignatureToAddress } from "../sdk/epnsUtils";



const FriendRecovery: NextPage = () => {
    const [oldAddress, setOldAddress] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [isSending, setIsSending] = useState(false);

    async function onSendSignClick(oldAddress:string, newAddress:string) {
        setIsSending(true);
        // plug in SDK
        const nonce = await getUserNonce(null, oldAddress);
        const message = await signRecoveryMessage(null, oldAddress, newAddress, nonce);
        const message2 = await sendSignatureToAddress(newAddress, message);
        setIsSending(false);
    }
=======
import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    Grid,
    Button,
    useDisclosure,
    SimpleGrid,
    GridItem,
    FormControl,
    FormLabel,
    Input,
    IconButton,
    Spinner,
    Stack, Container
} from "@chakra-ui/react";
import { useState } from "react";
import { signRecoveryMessage } from "../sdk/signRecoveryMessage";
import { sendSignatureToAddress } from "../sdk/epnsUtils";
import {AuthorizationTable} from "../components/AuthorizationTable";
import {AuthorizationForm} from "../components/AuthorizationForm";
import NoWallet from "../components/NoWallet";

import {FriendRecoveryForm} from "../components/FriendRecoveryForm";


const FriendRecovery: NextPage = () => {
>>>>>>> refs/remotes/origin/main

    return (
        <Container maxW={"3xl"}>

            <VStack
                as={Box}
                textAlign={"center"}
                spacing={{ base: 8, md: 14 }}
                py={{ base: 20, md: 25 }}

            >

                <Flex px={{ base: 6, md: 10 }} direction="column" gap={8}>
                    <Flex direction="column">
                        <Heading size="title.md">Friend Key Recovery</Heading>
                        <Text size="body.md" fontStyle="italic">
                            Input the old and new wallet address to help your friend recover their key
                        </Text>
                    </Flex>
                </Flex>


                <FriendRecoveryForm/>
            </VStack>
        </Container>
    );
};

export default FriendRecovery;
