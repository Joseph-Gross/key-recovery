import { ReactNode, useRef } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  InputGroup,
} from "@chakra-ui/react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { FiFile } from "react-icons/fi";

type FileUploadProps = {
  register: UseFormRegisterReturn;
  accept?: string;
  multiple?: boolean;
  children?: ReactNode;
};

const FileUpload = (props: FileUploadProps) => {
  const { register, accept, multiple, children } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void;
  };

  const handleClick = () => inputRef.current?.click();

  return (
    <InputGroup onClick={handleClick}>
      <input
        type={"file"}
        multiple={multiple || false}
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
      />
      <>{children}</>
    </InputGroup>
  );
};

type FormValues = {
  file_: FileList;
};

export const FileUploadForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit = handleSubmit((data) => console.log("On Submit: ", data));

  const validateFiles = (value: FileList) => {
    if (value.length < 1) {
      return "Upload at least one file";
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024);
      const MAX_FILE_SIZE = 10;
      if (fsMb > MAX_FILE_SIZE) {
        return "Max file size 10mb";
      }
    }
    return true;
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <FormControl isInvalid={!!errors.file_} isRequired>
          <FormLabel>{"File input"}</FormLabel>

          <FileUpload
            accept={""}
            multiple
            register={register("file_", { validate: validateFiles })}
          >
            <Button leftIcon={<Icon as={FiFile} />}>Upload</Button>
          </FileUpload>

          <FormErrorMessage>
            {errors.file_ && errors?.file_.message}
          </FormErrorMessage>
        </FormControl>

        <button>Submit</button>
      </form>
    </>
  );
};
