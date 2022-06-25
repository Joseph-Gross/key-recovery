import type { NextPage } from "next";
import { useEffect, useState } from "react";
import worldID from "@worldcoin/id";
import { Box, Button, Text, Heading, Stack, VStack, StackDivider, Grid, GridItem, SimpleGrid } from "@chakra-ui/react";
import { NotificationList } from "../components/NotificationList";

const PersonalRecovery: NextPage = () => {

  // worldID.init("world-id-container", {
  //   enable_telemetry: true,
  //   action_id: "wid_staging_90a71492daca49652946f01ead1524de",
  //   signal: "VerifyHuman"
  // });

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const result = await worldID.enable();
  //       console.log("World ID verified successfully:", result);
  //     } catch (failure) {
  //       console.warn("World ID verification failed:", failure);
  //       // Re-activate here so your end user can try again
  //     }
  //   })();
  // }, []);
  const [isRecovering, setIsRecovering] = useState(false);

  async function onRecoverClick(ncurrentAddress:string) {
    setIsRecovering(true);
    // plug in SDK
    setIsRecovering(false);
}
  // TO-DO: Set breakpoints for text
  return (
    <Box
        display={{ md: "flex" }}
        alignItems="center"
        minHeight="70vh"
        gap={8}
        mb={8}
        w="full"
        
        >
      <SimpleGrid columns={1} justifyItems='center'>
        <Heading fontSize='4xl' mb={4} >Personal Key Recovery</Heading>
        <Grid
          h='300px'
          w='full'
          templateRows='repeat(2, 1fr)'
          templateColumns='repeat(5, 1fr)'
          gap={4}
        >
          <GridItem rowSpan={2} colSpan={2} p={6} justifyItems='center'>
            <NotificationList/>
          </GridItem>
          <GridItem rowSpan={3} colSpan={3} p={10} justifyItems='center' justifySelf='center'>
            <Text fontSize='xl'  fontWeight={700}>
              Recover your key. Encryption will happen locally. Your private key will only be visible once.
              </Text>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1} colStart={4} justifyItems='center' justifySelf='center'>
            <Button onClick={()=>onRecoverClick('currentAddress')} isLoading={isRecovering}>
              Recover Key
            </Button>
          </GridItem>
        </Grid>
      </SimpleGrid>
    </Box>
  );
};

export default PersonalRecovery;
