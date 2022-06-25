import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  createIcon,
} from "@chakra-ui/react";

import Link from "next/link";

export function Hero() {
  return (
    <>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Secure Private Key Management with <br />
            <Text as={"span"} color={"green.400"}>
              Social Recovery
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Never lose access to your blockchain account again. Social recovery
            method for any EVM compatible chain. Implemented using advanced
            cryptography and threshold signatures.
          </Text>

          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <HStack spacing="24px">
              <Link href="/authorizationForm">
                <Button
                  colorScheme={"green"}
                  bg={"green.400"}
                  rounded={"full"}
                  px={6}
                  _hover={{
                    bg: "green.500",
                  }}
                >
                  Back Up
                </Button>
              </Link>
              <Link href="/personalRecovery">
                <Button
                  colorScheme={"green"}
                  bg={"green.400"}
                  rounded={"full"}
                  px={6}
                  _hover={{
                    bg: "green.500",
                  }}
                >
                  Recover Personal
                </Button>
              </Link>
              <Link href="/friendRecovery">
                <Button
                  colorScheme={"green"}
                  bg={"green.400"}
                  rounded={"full"}
                  px={6}
                  _hover={{
                    bg: "green.500",
                  }}
                >
                  Recover Friend
                </Button>
              </Link>
            </HStack>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
