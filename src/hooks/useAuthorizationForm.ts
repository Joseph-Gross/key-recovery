import { useEffect, useMemo } from "react";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
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
    watch,
    setValue,
  } = useForm<AuthorizationFormValues>();
  const { fields, append, remove } = useFieldArray({
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
    }),
    [fields, formState]
  );
}
