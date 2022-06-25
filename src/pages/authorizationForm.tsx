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
import AddGuardianModal from "../components/addGuardian";
import { AddIcon } from "@chakra-ui/icons";

// const {
//     isOpen: isAddGuardianModalOpen,
//     onOpen: onAddGuardianModalOpen,
//     onClose: onAddGuardianModalClose
// } = useDisclosure();

// function closeModals() {
//     onAddGuardianModalClose();
//   };

// const addRows: ReactElement = (rows: number) => {
//     for (var i=0; i<rows; i++) {
//         return (
//             null
//         )
//     }
// }

function onPlusClick(isplus: boolean, setplus: any): void {
  if (!isplus) {
    setplus(true);
  }
}

function displayGuardians(guardians: any, isplus: boolean) {
  let guardianList: Array<ReactElement> = [];
  var totalGuardians = guardians.length;

  for (var i = 0; i < totalGuardians; i++) {
    guardianList.push(
      <div key={i}>
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Wallet Address</FormLabel>
            <Input placeholder="Guardian Address" />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Guardian Label</FormLabel>
            <Input placeholder="example:  John Smith" />
          </FormControl>
        </GridItem>
      </div>
    );
  }
  if (isplus) {
    guardianList.push(
      <div>
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Wallet Address</FormLabel>
            <Input placeholder="Guardian Address" />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Guardian Label</FormLabel>
            <Input placeholder="example:  John Smith" />
          </FormControl>
        </GridItem>
      </div>
    );
  }

  return guardianList;
}

function onAddGuardiansClick(
  currentNumGuardians: number,
  setNumGuardians: any
) {
  setNumGuardians(currentNumGuardians + 1);
}

const AuthorizationForm: NextPage = () => {
  const [isPlus, setIsPlus] = useState(true);
  const [numGuardiansAdded, setNumGuardiansAdded] = useState(0);
  let guardians: { [address: string]: string } = {};
  const [guardiansToAdd, addGuardian] = useState<Map<string, string>>();
  // if (isPlus == true) {
  //     setNumGuardiansAdded(1);
  // }
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
      <Flex
        direction="column"
        background="gray.500"
        justifyContent="center"
        p={12}
        rounded={14}
      >
        <Heading size="2xl" mb={12}>
          Authorize Guardians{" "}
        </Heading>
        <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full" mb={4}>
          {displayGuardians(guardians, isPlus)}
        </SimpleGrid>
        {/* return guardianstoadd and then if plus is true also return 
                input simple grid else: */}
        <IconButton
          justifySelf="left"
          w="1.5"
          variant="outline"
          aria-label="Add Guardian to Authorize"
          icon={<AddIcon />}
          mb={6}
          onClick={() => onPlusClick(isPlus, setIsPlus)}
        />
        <Button>Add Guardians</Button>
        {/* <AddGuardianModal
                    isOpen={isAddGuardianModalOpen}
                    onClose={onAddGuardianModalClose}
                    />                 */}
      </Flex>
      {/* <Text>Authorization List</Text> */}
    </Box>
  );
};

export default AuthorizationForm;
