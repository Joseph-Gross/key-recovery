import { useEnsAddress, useEnsName, useProvider } from "wagmi";
import { ethers, providers } from "ethers";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputProps,
  FormHelperText,
  InputGroup,
  InputRightElement,
  Button,
  useClipboard,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

// user inputs ENS name or their wallet address
type Omitted = "disabled" | "required" | "readOnly" | "size";

export interface AddressInputProps {
  inputValue: string;
  onChange: (value: string) => void;
  label?: string;
  canCopy?: boolean;
}

export function AddressInput({
  inputValue,
  onChange,
  label,
  canCopy = true,
}: AddressInputProps) {
  // const [inputValue, setInputValue] = useState('');
  const {
    data: ensName,
    isError: isEnsNameError,
    isLoading: isEnsNameLoading,
  } = useEnsName({
    address: inputValue,
  });
  const {
    data: ensAddress,
    isError: isEnsAddressError,
    isLoading: isEnsAddressLoading,
  } = useEnsAddress({
    name: inputValue,
  });

  const inputIsEns = inputValue.endsWith(".eth") || inputValue.endsWith(".xyz");
  const isInvalidInput =
    (inputIsEns ? isEnsAddressError : !ethers.utils.isAddress(inputValue)) &&
    inputValue.length > 0;
  const helperMessage = inputIsEns ? ensAddress : ensName;

  const toCopy = inputIsEns ? ensAddress! : inputValue;
  const { hasCopied, onCopy } = useClipboard(toCopy);

  return (
      <FormControl isInvalid={isInvalidInput } w='full'>
        {label && (<FormLabel>{label}</FormLabel>)}
        <InputGroup size='md' minW='md' >
        <Input
            
            variant="filled"
            placeholder="Address or Ens"
            isInvalid={isInvalidInput}
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
        />
        {canCopy && (
          <InputRightElement width="5.0rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={onCopy}
              disabled={isInvalidInput}
            >
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      {isInvalidInput ? (
        <FormErrorMessage>Invalid address or ens</FormErrorMessage>
      ) : (
        <FormHelperText>
          {inputValue.length > 0 && helperMessage}
        </FormHelperText>
      )}
    </FormControl>
  );
}
