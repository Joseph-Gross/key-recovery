import { useEffect, useMemo } from "react";
import {
  Resolver,
  useController,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Guardian } from "../sdk/submitGuardians";

export interface AuthorizationFormValues {
  guardians: Array<Guardian>;
}

export function useAuthorizationForm() {
  const {
    register,
    handleSubmit,
    control,
    getFieldState,
    formState,
    getValues,
    setValue,
  } = useForm<AuthorizationFormValues>();
  const { fields, append, remove } = useFieldArray({
    name: "guardians",
    control,
  });

  const {
    field: { onChange, value },
  } = useController({
    name: "guardians",
    control,
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ address: "", label: "" }, { shouldFocus: false });
    }
  }, [fields]);

  return useMemo(
    () => ({
      register,
      handleSubmit,
      fields,
      append,
      remove,
      getFieldState,
      formState,
      setValue,
      value,
      getValues,
      control,
    }),
    [
      append,
      fields,
      formState,
      getFieldState,
      getValues,
      handleSubmit,
      register,
      remove,
      onChange,
    ]
  );
}
