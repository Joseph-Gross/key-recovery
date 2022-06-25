import { Heading, Stack, Box, Text, Container } from "@chakra-ui/react";

export default function NoWallet() {
  return (
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
          Connect your wallet
        </Heading>
        <Text color={"gray.500"}>
          You need to connect your wallet to deploy and interact with your key
          management
        </Text>
      </Stack>
    </Container>
  );
}
