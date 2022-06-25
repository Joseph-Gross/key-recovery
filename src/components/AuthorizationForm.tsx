import {
  Alert,
  AlertDescription,
  AlertIcon,
  Divider,
  Flex,
  FormControl,
    FormErrorMessage,
  IconButton,
  Input,
  Heading,
  Text,
  Button,
  FormLabel,
} from "@chakra-ui/react";

import { constants, ethers } from "ethers";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import {useAuthorizationForm} from "../hooks/useAuthorizationForm";


export function AuthorizationForm() {
  const {register, onSubmit, fields, append, remove, getFieldState, formState} = useAuthorizationForm();

  return (
    <>
      <Flex px={{ base: 6, md: 10 }} direction="column" gap={4}>
        <Flex direction="column">
          <Heading size="title.md">Guardian List</Heading>
          <Text size="body.md" fontStyle="italic">
            Define the guardians who can recover your key
          </Text>
        </Flex>

        <Flex direction="column" gap={4}>
          {fields.map((field, index) => {
            return (
              <Flex
                key={field.id}
                gap={2}
                direction={{ base: "column", md: "row" }}
              >
                <FormControl isInvalid={!!getFieldState(`guardians.${index}.address`, formState).error}>
                  <FormLabel>Address {index+1}</FormLabel>
                  <Input
                    variant="filled"
                    placeholder={constants.AddressZero}
                    {...register(`guardians.${index}.address`, {validate: (address) => ethers.utils.isAddress(address)})}
                  />
                  <FormErrorMessage>{
                    getFieldState(`guardians.${index}.address`, formState)
                        .error && "Invalid Address"
                  }</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={false}>
                  <FormLabel>Label {index+1}</FormLabel>
                  <Input
                      variant="filled"
                      placeholder="John Smith"
                      {...register(`guardians.${index}.label`)}
                  />
                </FormControl>
                <FormControl isInvalid={false}>
                  <FormLabel>Remove</FormLabel>
                  <IconButton
                      borderRadius="md"
                      isDisabled={index === 0}
                      colorScheme="red"
                      icon={<IoMdRemove />}
                      aria-label="remove row"
                      onClick={() => remove(index)}
                  />
                </FormControl>

              </Flex>
            );
          })}
        </Flex>

        {/* then render high level controls */}
        <Flex>
          <Button
            leftIcon={<IoMdAdd />}
            onClick={() => append({ address: "", label: "" })}
          >
            Add Guardian
          </Button>
        </Flex>

        <Button onClick={onSubmit}>Submit</Button>
      </Flex>
    </>
  );
}
