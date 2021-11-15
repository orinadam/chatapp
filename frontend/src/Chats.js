import { Box, Heading, Text } from "@chakra-ui/react";

import { useState } from "react";
import auth from "./ChatAppAPI";

const Chats = () => {
  return (
    <Box
      borderColor="blue"
      as="span"
      ml="2"
      bg="tomato"
      w="100%"
      p={4}
      color="white"
    >
      This is the Box
    </Box>
  );
};

export default Chats;
