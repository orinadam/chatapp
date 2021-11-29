import { Box, Heading, Text, Flex, Spacer } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedChat, chatMessgesState } from "./store";
import {DeleteIcon} from '@chakra-ui/icons'

const ChatIcon = (props) => {
  const setSelectedChat = useSetRecoilState(selectedChat);
    const handleClick = () => {
      setSelectedChat(props);
      console.log("dsah")

    }
    return (
        <Flex w="100%" border='1px solid #BDBDBD' cursor="pointer">
        <Box border='1px solid #BDBDBD' cursor="pointer" _hover={{background: "#E0E0E0",color: "teal", }} padding={1} h={50} w="90%" borderColor="gray.300" borderRadius={2} onClick={handleClick}>
          <Heading paddingTop={1.5} fontSize={17} marginLeft={2}>{props.username}</Heading>
          <Text fontSize="10" marginLeft={4} color="gray.600" isTruncated>{props.lastMessage}</Text>
        </Box>
        <Spacer />
          <DeleteIcon boxSize="1.8em" viewBox="0 0 24 24" marginTop={3} cursor="pointer" _hover={{background: "#E0E0E0",color: "red.700", }} color="gray.400" />
        </Flex>
    )
}

export default ChatIcon;