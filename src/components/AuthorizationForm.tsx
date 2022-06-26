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
  Textarea,
  Box,
  Stack,
  HStack,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { constants, ethers } from "ethers";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import {
  AuthorizationFormValues,
  useAuthorizationForm,
} from "../hooks/useAuthorizationForm";
import React, { useState } from "react";
import { useSubmitGuardians } from "../hooks/useSubmitGuardians";

export function AuthorizationForm() {
  const {
    register,
    handleSubmit,
    fields,
    append,
    remove,
    getFieldState,
    setValue,
    formState,
    value,
  } = useAuthorizationForm();
  const [privateKey, setPrivateKey] = useState<string>("");

  const { isSubmitLoading, onSubmit } = useSubmitGuardians(privateKey);

  const handleInputChange = (e: { target: { value: any } }) => {
    let inputValue = e.target.value;
    setPrivateKey(inputValue);
  };

  function submitForm(data: AuthorizationFormValues) {
    console.log(
      "Encrypting private key, uploading to IPFS, adding authorized guardians, etc."
    );
    console.log(data);
    onSubmit(data.guardians).then((r) => console.log("Form Submitted"));
  }

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <>
      <Flex px={{ base: 6, md: 10 }} direction="column" gap={8}>
        <Flex direction="column">
          <Heading size="title.md">Guardian List</Heading>
          <Text size="body.md" fontStyle="italic">
            Define the guardians who can collectively recover your key
          </Text>
        </Flex>

        <Flex direction="column" gap={4}>
          {fields.map((field, index) => {
            return (
              <HStack
                key={field.id}
                spacing={3}
                direction={{ base: "column", md: "row" }}
              >
                <FormControl
                  isInvalid={
                    !!getFieldState(`guardians.${index}.address`, formState)
                      .error
                  }
                >
                  <Input
                    variant="filled"
                    placeholder={constants.AddressZero}
                    {...register(`guardians.${index}.address`, {
                      validate: (address) => ethers.utils.isAddress(address),
                    })}
                  />
                  <FormErrorMessage>
                    {getFieldState(`guardians.${index}.address`, formState)
                      .error && "Invalid Address"}
                  </FormErrorMessage>
                </FormControl>
                <FormControl>
                  <Input
                    variant="filled"
                    placeholder="John Smith"
                    {...register(`guardians.${index}.label`)}
                  />
                </FormControl>

                <IconButton
                  borderRadius="md"
                  isDisabled={index === 0}
                  colorScheme="red"
                  icon={<IoMdRemove />}
                  aria-label="remove row"
                  onClick={() => remove(index)}
                />
              </HStack>
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

        <FormControl isInvalid={false}>
          <FormLabel>Private Key</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              value={privateKey}
              onChange={handleInputChange}
              placeholder="Paste your private key or seed phrase to encrypt for social recovery"
              size="md"
            />
            <InputRightElement width="5.5rem">
              <Button h="1.5rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button onClick={handleSubmit(submitForm)} isLoading={isSubmitLoading}>
          Submit
        </Button>
      </Flex>
    </>
  );
}
