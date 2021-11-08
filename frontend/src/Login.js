import {
  ChakraProvider,
  Flex,
  Heading,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  FormControl,
} from "@chakra-ui/react";

import { useState } from "react";
import auth from "./ChatAppAPI"

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const submitForm = async (e) => {
    alert(username + password)
    const resp = await auth.login("/login", {username: username, password: password});
    alert(resp)

  };
  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex
          direction="column"
          background="gray.100"
          width="30vw"
          p={8}
          pt={12}
          rounded={8}
        >
          <Heading mb={10}>Login</Heading>
          <FormControl isInvalid={false}>
            <Input placeholder="Username" variant="filled" mb={10} onChange={(e) => {setUsername(e.target.value)}} />
            <Input placeholder="Password" variant="filled" mb={10} onChange={(e) => {setPassword(e.target.value)}} />
          </FormControl>
          {false && (
            <Alert status="error" mb={7}>
              <AlertIcon />
              <AlertTitle mr={2}>Invalid username or password</AlertTitle>
            </Alert>
          )}
          <Button colorScheme="teal" onClick={submitForm}>
            Login
          </Button>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Login;
