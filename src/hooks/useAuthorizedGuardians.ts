/**
 * Returns a list of Guardian objects for a given user
 */
import { useEffect, useMemo, useState } from "react";

import { Guardian, submitGuardians } from "../sdk/submitGuardians";
import { useAccount } from "wagmi";
import { usePrivySession } from "../components/PrivySession";

export function useAuthorizedGuardians() {
  const { data: account } = useAccount();
  const privySession = usePrivySession();

  const [guardians, setGuardians] = useState<Array<Guardian>>();

  useEffect(() => {
    async function fetchAuthorizedGuardiansFromPrivy() {
      try {
        const rawGuardians = await privySession.privy.get(
          account!.address as string,
          "authorized-guardians-json"
        );
        setGuardians(JSON.parse(rawGuardians!.text()));
      } catch (error) {
        console.log(error);
      }
    }

    fetchAuthorizedGuardiansFromPrivy();
  }, [account, privySession]);

  return useMemo(
    () => ({
      hasBackedUp: guardians ? guardians.length > 0 : false,
      // hasBackedUp: false, // set to true when you want to deploy to production
      guardians,
    }),
    [guardians, account]
  );
}
