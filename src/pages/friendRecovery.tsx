import type { NextPage } from "next";
import { constants } from "ethers";
import { Box, Flex, Heading, Text, Grid, Button, useDisclosure, SimpleGrid, GridItem, FormControl, FormLabel, Input, IconButton } from "@chakra-ui/react";
import { useState } from "react";


function onSendSignClick(oldAddress:string, newAddress:string): void {
    // plug in SDK
}

const FriendRecovery: NextPage = () => {
    const [oldAddress, setOldAddress] = useState('');
    const [newAddress, setNewAddress] = useState('');

    return (
        <Box
            display={{ md: "flex" }}
            alignItems="center"
            minHeight="70vh"
            gap={8}
            mb={8}
            w="full"
        >
            <Flex direction="column" background="gray.500" justifyContent="center" p={12} rounded={14}>
                <Heading size="2xl" mb={12} >Friend Recovery</Heading>
                <SimpleGrid columns={2} columnGap={3} rowGap={6} w='full' mb={10}>
                    <GridItem colSpan={1}>
                        <Text fontSize='xl' mr={4} >Friend's Old Address:</Text>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Input id='oldAddress' onChange={a => setOldAddress(a.target.value)} variant='outline' placeholder={constants.AddressZero}/>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Text fontSize='xl' mr={4} >Friend's New Address:</Text>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Input id='newAddress' onChange={a => setNewAddress(a.target.value)} variant='outline' placeholder={constants.AddressZero}/>
                    </GridItem>
                </SimpleGrid>
                <Button>Sign and Send</Button>

            </Flex>
        </Box>
    );
};

export default FriendRecovery;