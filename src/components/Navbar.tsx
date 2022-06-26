import {
  Box,
  Flex,
  Heading,
  Tabs,
  TabList,
  Tab,
  HStack,
  VisuallyHidden,
  Link,
  CloseButton,
  InputGroup,
  InputLeftElement,
  Input,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
// import { Link as ReachLink } from "@reach/router"
// import Link from "next/link";

import ConnectAccount from "./ConnectAccount";

import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { RiMoonFill, RiSunLine } from "react-icons/ri";
import { IconButton } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";

export default function Navbar() {
  const bg = useColorModeValue("white", "gray.800");
  const mobileNav = useDisclosure();

  const { toggleColorMode: toggleMode } = useColorMode();
  const hoverBg = useColorModeValue("gray.500", "gray.700");
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(RiMoonFill, RiSunLine);

  const bgColor = useColorModeValue("blue.200", "blue.500");

  return (
    <Box shadow="2xl" borderRadius="3xl">
      <Heading
        bg={bg}
        borderColor={useColorModeValue("gray.400", "blue.500")}
        borderBottomWidth={1}
        w="full"
        px={{ base: 2, sm: 4 }}
        py={4}
      >
        {/* MobileNav - setting */}
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <HStack spacing={4} display="flex" alignItems="center">
            <Box display={{ base: "inline-flex", md: "none" }}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color={useColorModeValue("gray.800", "inherit")}
                variant="solid"
                icon={<AiOutlineMenu />}
                onClick={mobileNav.onOpen}
              />
              <VStack
                pos="absolute"
                top={0}
                left={0}
                right={0}
                display={mobileNav.isOpen ? "flex" : "none"}
                flexDirection="column"
                p={2}
                pb={4}
                m={2}
                bg={bg}
                spacing={3}
                rounded="sm"
                shadow="sm"
              >
                <CloseButton
                  aria-label="Close menu"
                  justifySelf="self-start"
                  onClick={mobileNav.onClose}
                />

                <ConnectAccount />
                <IconButton
                  bg={bgColor}
                  borderRadius="2xl"
                  size="md"
                  w={90}
                  fontSize="lg"
                  aria-label={`Switch to ${text} mode`}
                  variant="solid"
                  color="current"
                  ml={{ base: "0", md: "3" }}
                  onClick={toggleMode}
                  icon={<SwitchIcon />}
                />
              </VStack>
            </Box>
            <Link href="/" style={{ textDecoration: "none" }}>
              {/* <Logo /> */}
              <VisuallyHidden>KeyKover</VisuallyHidden>
              <Heading
                as="h1"
                fontWeight="semibold"
                fontSize="2xl"
                _hover={{
                  textColor: hoverBg,
                }}
              >
                KeyKover
              </Heading>
            </Link>
          </HStack>
          <HStack spacing={3} display="flex" alignItems="center">
            <HStack spacing={3} display={{ base: "none", md: "inline-flex" }}>
              <ConnectAccount />

              <IconButton
                borderRadius="2xl"
                size="md"
                fontSize="lg"
                aria-label={`Switch to ${text} mode`}
                variant="solid"
                color="current"
                ml={{ base: "0", md: "3" }}
                onClick={toggleMode}
                icon={<SwitchIcon />}
              />
            </HStack>
            <Link
              p={3}
              color={useColorModeValue("gray.800", "inherit")}
              rounded="sm"
              _hover={{ color: useColorModeValue("gray.800", "gray.600") }}
            />
          </HStack>
        </Flex>
      </Heading>

      {/* DesktopNav - setting */}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mx={2}
        borderWidth={0}
        overflowX="auto"
      ></Flex>
    </Box>
  );
}
