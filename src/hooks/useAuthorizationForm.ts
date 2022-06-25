import {useEffect, useMemo} from "react";
import {Resolver, useFieldArray, useForm} from "react-hook-form";
import {ethers} from "ethers";

interface Guardian {
    address: string;
    label: string;
}

export interface AuthorizationFormValues {
    guardians: Guardian[],
}


export function useAuthorizationForm() {
    const { register, handleSubmit, control, getFieldState, formState, watch, setValue } = useForm<AuthorizationFormValues>();
    const { fields, append, remove } = useFieldArray({
        name: "guardians",
        control,
    });

    function onSubmit(data: AuthorizationFormValues) {
        console.log(JSON.stringify(data.guardians));
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
        getFieldState,
        formState,
    }), [fields, formState]);
}
