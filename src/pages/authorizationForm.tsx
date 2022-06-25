import type { NextPage } from "next";

import { Box, Text } from "@chakra-ui/react";
import {FileUploadForm} from "../components/FileUpload";

const AuthorizationForm: NextPage = () => {
    return (
        <Box
            display={{ md: "flex" }}
            alignItems="center"
            minHeight="70vh"
            gap={8}
            mb={8}
            w="full"
        >
            <Text>Authorization Form</Text>
            <FileUploadForm/>
        </Box>
    );
};

export default AuthorizationForm;
