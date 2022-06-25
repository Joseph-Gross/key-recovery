import {
  Flex,
  Link,
  Text,
  Box,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  const bg = useColorModeValue("white", "inherit");
  const color = useColorModeValue("white", "inherit");
  const borderColor = useColorModeValue("gray.400", "blue.500");

  return (
    <Box bg={bg} color={color}>
      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={borderColor}
        color={useColorModeValue("gray.900", "blue.500")}
      >
        <Container maxW={"6xl"} py={4}>
          <Text>
            {new Date().getFullYear()} -{" "}
            <Link href="/" isExternal rel="noopener noreferrer">
              © Copyright 2022, KeyKovery. All Rights Reserved.
            </Link>
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
