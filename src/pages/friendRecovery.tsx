import type { NextPage } from "next";
import { constants } from "ethers";

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
  Stack,
  Container,
} from "@chakra-ui/react";
import { useState } from "react";
import { signRecoveryMessage } from "../sdk/signRecoveryMessage";
import { sendSignatureToAddress } from "../sdk/epnsUtils";
import { AuthorizationTable } from "../components/AuthorizationTable";
import { AuthorizationForm } from "../components/AuthorizationForm";
import NoWallet from "../components/NoWallet";

import { FriendRecoveryForm } from "../components/FriendRecoveryForm";

const FriendRecovery: NextPage = () => {
  return (
    <Container maxW={"3xl"}>
      <VStack
        w='full'
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 25 }}
      >
        <Flex px={{ base: 6, md: 10 }} direction="column" gap={8}>
          <Flex direction="column" >
            <Heading size="3xl" mb={12}>Friend Key Recovery</Heading>
            <Text size="body.md" fontStyle="italic" mb={8}>
              Input the old and new wallet address to help your friend recover
              their key
            </Text>
          </Flex>
        </Flex>

        <FriendRecoveryForm />
      </VStack>
    </Container>
  );
};

export default FriendRecovery;
