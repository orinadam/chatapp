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
import { auth } from "./ChatAppAPI"
// import axios from "axios"
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const submitForm = async (e) => {
    try {
      //const resp1 = await axios.post('http://localhost:5000/login', { username, password });
      const resp = await auth.login('/login', { username, password })
      console.log(resp.success)
      setError(false);
    } catch (e) {
      setError(true);
      console.log(e.response.data.error)
    }
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
          <FormControl isInvalid={error}>
            <Input placeholder="Username" variant="filled" mb={10} onChange={(e) => { setUsername(e.target.value) }} />
            <Input placeholder="Password" variant="filled" mb={10} onChange={(e) => { setPassword(e.target.value) }} />
          </FormControl>
          {error && (
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
