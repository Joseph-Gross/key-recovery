import {
  Alert,
  AlertDescription,
  AlertIcon,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";

import { constants } from "ethers";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

export function RecipientForm() {
  const { register, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "guardians",
    control,
  });
  useEffect(() => {
    if (fields.length === 0) {
      append({ address: "", label: "" }, { shouldFocus: false });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Divider />
      <Flex px={{ base: 6, md: 10 }} as="section" direction="column" gap={4}>
        <Flex direction="column">
          <Heading size="title.md">Guardian List</Heading>
          <Text size="body.md" fontStyle="italic">
            Define the guardians who can recover your key
          </Text>
        </Flex>

        <Flex direction="column" gap={2}>
          {fields.map((field, index) => {
            return (
              <Flex
                key={field.id}
                gap={2}
                direction={{ base: "column", md: "row" }}
              >
                <FormControl isInvalid={false}>
                  <Input
                    variant="filled"
                    placeholder={constants.AddressZero}
                    {...register(`recipients.${index}.address`)}
                  />
                </FormControl>
                <FormControl isInvalid={false}>
                  <Input
                    variant="filled"
                    placeholder={constants.AddressZero}
                    {...register(`recipients.${index}.address`)}
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
      </Flex>
    </>
  );
}
