import { Box, Heading, Text, Flex } from "@chakra-ui/react";

const ChatIcon = (props) => {
    return (
        <Box border='1px solid #BDBDBD' cursor="pointer" _hover={{background: "#E0E0E0",color: "teal", }} padding={1} h={50} w={200} borderColor="gray.300" borderRadius={2}>
          <Heading paddingTop={1.5} fontSize={17} marginLeft={2}>{props.username}</Heading>
          <Text fontSize="10" marginLeft={4} color="gray.600">{props.lastMessage}</Text>
        </Box>
    )
}

export default ChatIcon;