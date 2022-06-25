import type { NextPage } from "next";

import { Box, Container, Text, Stack } from "@chakra-ui/react";
import {useBackup} from "../hooks/useBackUp";
import {AuthorizationTable} from "../components/AuthorizationTable";
import {AuthorizationForm} from "../components/AuthorizationForm";
import {useAccount} from "wagmi";
import NoWallet from "../components/NoWallet";

const AuthorizationList: NextPage = () => {

    const {isBackedUp} = useBackup();

    const { data, isError } = useAccount()


    console.log()

    return (
        <Container maxW={"3xl"}>
            <Stack
                as={Box}
                textAlign={"center"}
                spacing={{ base: 8, md: 14 }}
                py={{ base: 20, md: 25 }}
            >

            {data?.address ?

            <>{isBackedUp ? <AuthorizationTable/> : <AuthorizationForm/>}</> : <NoWallet/>

            }
            </Stack>
        </Container>
    );
};

export default AuthorizationList;
