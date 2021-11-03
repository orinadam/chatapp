import {
  ChakraProvider,
  Flex,
  Heading,
  Input,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";

const Signup = () => {
  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex
          direction="column"
          background="gray.100"
          height="40vh"
          width="30vw"
          p={8}
          pt={12}
          rounded={8}
        >
          <Heading mb={10}>Login</Heading>
          <Input placeholder="Username" variant="filled" mb={10} />
          <Input placeholder="Password" variant="filled" mb={10} />
          <FormErrorMessage>Error</FormErrorMessage>
          <Button colorScheme="teal">Login</Button>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Signup;
