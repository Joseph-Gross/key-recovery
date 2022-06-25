import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
import {usePrivySession} from "./PrivySession";
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";
import {Guardian} from "../sdk/submitGuardians";

export function AuthorizationTable() {
    const { data: account } = useAccount();
    const privySession = usePrivySession();

    const [guardians, setGuardians] = useState<Array<Guardian>>()


    useEffect(() => {
        async function fetchAuthorizedGuardiansFromPrivy() {
            try {
                const rawGuardians = await privySession.privy.get(account!.address as string, "authorized-guardians-json");
                setGuardians(JSON.parse(rawGuardians!.text()));
            } catch (error) {
                console.log(error);
            }
        }

        fetchAuthorizedGuardiansFromPrivy();
    }, [account, privySession]);


    return (
        <>
            <TableContainer>
                <Table variant='simple'>
                    <TableCaption>Authorized Guardians</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Address</Th>
                            <Th>Label</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {guardians?.map((guardian, index) => {
                            return (
                                <Tr key={index}>
                                    <Td>{guardian.address}</Td>
                                    <Td>{guardian.label}</Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
}
