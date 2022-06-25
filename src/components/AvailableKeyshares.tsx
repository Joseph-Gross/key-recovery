import type { NextPage } from "next";

import { Box, Text, Heading, Stack } from "@chakra-ui/react";
import { fetchSignatureNotifications } from "../sdk/epnsUtils";
import { useState } from "react";

function fetchSignatures() {
  const sigs = fetchSignatureNotifications();
}

const AvailableKeyshares: NextPage = () => {
  return (
    <Stack
      as={Box}
      direction={["column"]}
      align={"center"}
      textAlign={"center"}
      spacing={{ base: 8, md: 14 }}
      py={{ base: 20, md: 36 }}
    ></Stack>
  );
};

export default PersonalRecovery;
