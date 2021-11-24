import { Box, Text, HStack, Spacer, Flex } from "@chakra-ui/react";

const Message = (props) => {
    return (
        <HStack w="100%" marginTop={4}>
            {!props.sender && <Spacer></Spacer>}
            <Flex justifyContent={props.sender ? "" : "end"} width="20%" marginTop={4}><Text bg={props.sender ? "blue.200" : "gray.400"} ml={props.sender ? "10px" : "0px"} mr={props.sender ? "0px" : "10px"} padding={2} borderRadius={7} overflow="auto" width="fit-content">{props.text}</Text></Flex>
        </HStack>

    )
}

export default Message;