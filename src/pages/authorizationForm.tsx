import type { NextPage } from "next";
import { useState, useEffect, ReactElement, Dispatch, Fragment } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  Button,
  useDisclosure,
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  IconButton,
} from "@chakra-ui/react";

import {AuthorizationForm} from "../components/AuthorizationForm";


const AuthorizationPage: NextPage = () => {

  return (
    <Box
      display={{ md: "flex" }}
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={8}
      mb={8}
      w="full"
    >
      <AuthorizationForm/>
    </Box>
  );
};

export default AuthorizationPage;
