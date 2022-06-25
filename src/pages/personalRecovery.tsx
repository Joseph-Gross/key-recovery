import type { NextPage } from "next";

import { Box, Text, Heading, Stack, VStack, StackDivider } from "@chakra-ui/react";
import { FileUploadForm } from "../components/FileUpload";

const PersonalRecovery: NextPage = () => {
    return (
        <Stack
            as={Box}
            direction={['column']}
            align={'center'}
            textAlign={'center'}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 20, md: 36 }}>
            <Heading
                fontWeight={200}
                fontSize={{ base: 'md', sm: '2xl', md: '5xl' }}
                lineHeight={'110%'}>
                You lost your key! HAHAHAHA!
            </Heading>
{/*                <FileUploadForm/>*/}
        </Stack>
    );}

export default PersonalRecovery;
