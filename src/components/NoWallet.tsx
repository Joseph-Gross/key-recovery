import {
    Center,
    Flex,
    Heading,
    Stack,
    Box,
    Text,
    Container, useColorModeValue
} from "@chakra-ui/react";

import ConnectAccount from "./ConnectAccount";

export default function NoWallet() {
    return (
        <Center w="100%" py={6}>
            <Box
                maxW={'445px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                rounded={'md'}
                p={6}
                overflow={'hidden'}
            justify-content="center">

                <Heading
                        color={useColorModeValue('gray.700', 'white')}
                        fontSize={'2xl'}
                        fontFamily={'body'}>
                        Connect your wallet
                    </Heading>
                    <Text color={'gray.500'}>
                        You need to connect your wallet to deploy and interact with your key management
                    </Text>
            </Box>

        </Center>
    );
};
