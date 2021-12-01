import {
  ChakraProvider,
  Flex,
  Heading,
  Input,
  Button,
  Alert,
  Text,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  FormControl,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

import { useRecoilState, useRecoilCallback } from "recoil";

import { useState } from "react";
import { auth } from "./ChatAppAPI";
import { chatMessgesState, selectedUser, connectedUser } from "./store";
// import axios from "axios"
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
import { useHistory } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [user, setUser] = useRecoilState(connectedUser);
  const history = useHistory();
  const submitForm = useRecoilCallback(({ set }) => async () => {
    try {
      const resp = await auth.login("/login", { username, password });
      console.log(resp.success);
      setError(false);
      set(connectedUser, {
        userId: resp.success.user.id,
        profilePhoto: resp.success.user.profilePhoto,
        username: resp.success.user.username,
      });
      document.location.href="/chats";

    } catch (e) {
      setError(true);
    }
  });
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center" direction="column">
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
          <Input
            placeholder="Username"
            variant="filled"
            mb={10}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            placeholder="Password"
            type="password"
            variant="filled"
            mb={10}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
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
      <Link to="/signup"><Text color="gray.500" marginTop={3}>Not signed up already? Signup</Text></Link>
    </Flex>
  );
};

export default Login;
