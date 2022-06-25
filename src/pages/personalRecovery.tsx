import type { NextPage } from "next";
import worldID from "@worldcoin/id";
import { Box, Text, Heading, Stack, VStack, StackDivider } from "@chakra-ui/react";
import { FileUploadForm } from "../components/FileUpload";

const PersonalRecovery: NextPage = () => {

  worldID.init("world-id-container", {
    enable_telemetry: true,
    action_id: "wid_staging_90a71492daca49652946f01ead1524de",
    signal: "VerifyHuman"
  });

  useEffect(() => {
    try {
      const result = await worldID.enable();
      console.log("World ID verified successfully:", result);
    } catch (failure) {
      console.warn("World ID verification failed:", failure);
      // Re-activate here so your end user can try again
    }
  });

  return (
    <VStack
      divider={<StackDivider borderColor='gray.500' />}
      spacing={2}
      align='stretch'
      >
      <div id="world-id-container"></div>
    </VStack>
    // <Stack
    //   as={Box}
    //   direction={["column"]}
    //   align={"center"}
    //   textAlign={"center"}
    //   spacing={{ base: 8, md: 14 }}
    //   py={{ base: 20, md: 36 }}
    // >
    //   <Heading
    //     fontWeight={200}
    //     fontSize={{ base: "md", sm: "2xl", md: "5xl" }}
    //     lineHeight={"110%"}
    //   >
    //     I lost my key! <br />
    //     <Text color={"green.400"}>Submit signature files here to recover.</Text>
    //   </Heading>
    //   <FileUploadForm />
    // </Stack>
  );
};

export default PersonalRecovery;
