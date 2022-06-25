import type { NextPage } from "next";

import { Box, Text } from "@chakra-ui/react";
import {useBackup} from "../hooks/useBackUp";
import {AuthorizationTable} from "../components/AuthorizationTable";
import {AuthorizationForm} from "../components/AuthorizationForm";
import {useAccount} from "wagmi";
import NoWallet from "../components/NoWallet";

const AuthorizationList: NextPage = () => {

    const {isBackedUp} = useBackup();

    const { data, isError } = useAccount()

    console.log(data);

    return (
        <Box
            display={{ md: "flex" }}
            alignItems="center"
            minHeight="70vh"
            gap={8}
            mb={8}
            w="full"
        >
            {isError ? <NoWallet/> :

            <>{isBackedUp ? <AuthorizationTable/> : <AuthorizationForm/>}</>

            }
        </Box>
    );
};

export default AuthorizationList;
