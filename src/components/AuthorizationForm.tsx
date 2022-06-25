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
} from "@chakra-ui/react";

import { constants, ethers } from "ethers";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import {AuthorizationFormValues, useAuthorizationForm} from "../hooks/useAuthorizationForm";
import {useState} from "react";
// import * as litUtils from "../sdk/litUtils"
import * as tatumUtils from "../sdk/tatumUtils";
import {usePrivySession} from "./PrivySession";


export function AuthorizationForm() {
  const {register, handleSubmit, fields, append, remove, getFieldState, formState} = useAuthorizationForm();
  const [privateKey, setPrivateKey] = useState<string>('')

  const handleInputChange = (e: { target: { value: any; }; }) => {
    let inputValue = e.target.value
    setPrivateKey(inputValue)
  }

  const privySession = usePrivySession();

  async function submitForm(data: AuthorizationFormValues) {
    // const encryptedKey = await litUtils.encryptString(privateKey);
    const encryptedKey = "";
    const encryptedKeyCid = await tatumUtils.uploadToIPFS(encryptedKey);

    const authorizedGuardiansJson = JSON.stringify(data.guardians);

    await privySession.privy.put(privySession.address, [
      {field: 'encrypted-key-cid', value: encryptedKeyCid},
      {field: 'authorized-guardians-json', value: authorizedGuardiansJson},
    ]);
  }


  function onSubmit(data: AuthorizationFormValues) {
    console.log("Encrypting private key, uploading to IPFS, adding authorized guardians, etc.");
    submitForm(data).then(response => console.log("Response Submitted"));

  }

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

        <FormControl isInvalid={false}>
          <FormLabel>Private Key</FormLabel>
          <Textarea
              value={privateKey}
              onChange={handleInputChange}
              placeholder='Paste your private key or seed phrase to encrypt for social recovery'
              size='sm'
          />
        </FormControl>

        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </Flex>
    </>
  );
}
