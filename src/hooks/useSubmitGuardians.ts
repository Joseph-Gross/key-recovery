import {useCallback, useEffect, useMemo, useState} from "react";
import {usePrivySession} from "../components/PrivySession";
import {useContract, useSigner} from "wagmi";
import {KEYKOVERY_CONTRACT_ADDRESS} from "../sdk/constants";
import KEYKOVERY_ABI from "../sdk/abis/Keycovery.json";
import {Guardian, submitGuardians} from "../sdk/submitGuardians";


export function useSubmitGuardians(privateKey: string) {
    const privySession = usePrivySession();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>();

    const { data: signer, isError, isLoading: isSignerLoading } = useSigner()
    const contract = useContract({
        addressOrName: KEYKOVERY_CONTRACT_ADDRESS,
        contractInterface: KEYKOVERY_ABI,
        signerOrProvider: signer,
    })

    const onSubmit = useCallback(async (guardians: Array<Guardian>) => {
        setIsSubmitLoading(true);
        await submitGuardians(signer!, contract, privateKey, guardians, privySession.privy);
        setIsSubmitLoading(false);
    }, [contract, privateKey, privySession.privy, signer])

    return useMemo(() => ({
       isSubmitLoading,
        onSubmit,
    }), [isSubmitLoading, onSubmit]);



}
