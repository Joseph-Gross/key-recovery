import {useEffect, useMemo} from "react";
import {useFieldArray, useForm} from "react-hook-form";

interface Guardian {
    address: string;
    label: string;
}

export interface AuthorizationFormValues {
    guardians: Guardian[],
}

export function useAuthorizationForm() {
    const { register, handleSubmit, control, watch } = useForm<AuthorizationFormValues>();
    const { fields, append, remove } = useFieldArray({
        name: "guardians",
        control,
    });

    function onSubmit(data: AuthorizationFormValues) {
        console.log(data);
    }

    useEffect(() => {
        if (fields.length === 0) {
            append({ address: "", label: "" }, { shouldFocus: false });
        }
    }, [fields]);


    return useMemo(() => ({
        register,
        onSubmit: handleSubmit(onSubmit),
        fields,
        append,
        remove,
    }), [fields]);
}
