import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Heading,
  TableContainer,
} from "@chakra-ui/react";
import { usePrivySession } from "./PrivySession";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Guardian } from "../sdk/submitGuardians";
import { useAuthorizedGuardians } from "../hooks/useAuthorizedGuardians";

export function AuthorizationTable() {
  const { guardians } = useAuthorizedGuardians();

  return (
    <>
      <Heading>Authorized Guardians</Heading>
      <TableContainer>
        <Table variant="simple">
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
