import { useEnsName, useProvider } from "wagmi";
import { providers } from "ethers";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputProps,
  FormHelperText
} from '@chakra-ui/react';
import { useState, useEffect } from "react";


// user inputs ENS name or their wallet address
type Omitted = "disabled" | "required" | "readOnly" | "size"


export interface AddressInputProps {
  /**
   * The provider or signer to fetch the address from the ens
   */
  provider: providers.BaseProvider;
  /**
   * The value for the input
   */
  value: string;
  /**
   * The label for the input
   */
  label?: string;
  /**
   * Change handler for the text input
   */
  onChange: (value: string) => void;
}

/**
 * A text input component that is used to get ETH addresses. ENS support included. You can also pass all the styling props of the Chakra UI Input component.
 */
export const AddressInput: React.FC<AddressInputProps & InputProps> = ({
  provider,
  value: _value,
  onChange,
  label,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  // const debouncedValue = useDebounce(inputValue, 700);
  const [error, setError] = useState<null | string>(null);
  // use ethers address checking instead
  const regex = /^0x[a-fA-F0-9]{40}$/;

  const getAddressFromEns = async () => {
    try {
      const address = await provider.resolveName(inputValue);
      if (!address) {
        setError('Invalid Input');
      }
      return address;
    } catch (error) {
      setError(error as string);
      return;
    }
  };

  useEffect(() => {
    if (inputValue) {
      onChange('');
      setError(null);
      if (regex.test(inputValue)) {
        onChange(inputValue);
      } else if (
        inputValue.endsWith('.eth') ||
        inputValue.endsWith('.xyz')
      ) {
        getAddressFromEns().then((address) => onChange(address ? address : ''));
      }
    }
  }, [inputValue]);

  useEffect(() => {
    if (inputValue === '') {
      onChange('');
      setError(null);
    }
  }, [inputValue]);

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel>Input address</FormLabel>}
      <Input
        isInvalid={!!error}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        {...props}
      />
      <FormHelperText>We'll never share your email.</FormHelperText>
      <FormErrorMessage>{error ? ' ' + error : ''}</FormErrorMessage>
    </FormControl>
  );
};