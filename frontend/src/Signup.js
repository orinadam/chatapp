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

import { useRecoilState, useRecoilCallback } from "recoil";

import { useState } from "react";
import { auth } from "./ChatAppAPI";
import { chatMessgesState, selectedUser, connectedUser } from "./store";
// import axios from "axios"
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
import { useHistory } from "react-router-dom";

const Signup = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [user, setUser] = useRecoilState(connectedUser);

  const submitForm = useRecoilCallback(({ set }) => async () => {
    try {
      const resp = await auth.signup("/signup", { username, password });
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
<Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex
        direction="column"
        background="gray.100"
        width="30vw"
        p={8}
        pt={12}
        rounded={8}
      >
        <Heading mb={10}>Signup</Heading>
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
            <AlertTitle mr={2}>User Already taken or password is not long enough</AlertTitle>
          </Alert>
        )}
        <Button colorScheme="teal" onClick={submitForm}>
          Signup
        </Button>
      </Flex>
    </Flex>
  );
};

export default Signup;
