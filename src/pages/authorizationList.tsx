import type { NextPage } from "next";

import { Box, Text } from "@chakra-ui/react";
import NoWallet from "../components/NoWallet";
import { RecipientForm } from "../components/AuthorizationForm";

const AuthorizationList: NextPage = () => {
  return (
    <Box
      display={{ md: "flex" }}
      alignItems="center"
      minHeight="70vh"
      gap={8}
      mb={8}
      w="full"
    >
      {/*<NoWallet/>*/}
      <RecipientForm />
    </Box>
  );
};

export default AuthorizationList;
