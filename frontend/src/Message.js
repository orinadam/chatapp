import { Box, Text, HStack, Spacer, Flex,  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
 } from "@chakra-ui/react";
 import { chatsActions } from "./ChatAppAPI";

 const copyToClipboard = (text) =>{
     if(text){
        navigator.clipboard.writeText(text);
     }
 }

 const deleteMessage = async (chatId, id) => {
     await chatsActions.deleteMessage(`/chats/${chatId}/messages/${id}`, chatId, id);
    
 }

const Message = (props) => {
    return (
        <HStack w="100%" marginTop={4}>
            {!props.sender && <Spacer></Spacer>}
            <Menu>
                <Flex justifyContent={props.sender ? "" : "end"} width="20%" marginTop={4}>
                    <MenuButton>
                    <Text cursor="pointer"  bg={props.sender ? "blue.200" : "gray.400"} ml={props.sender ? "10px" : "0px"} mr={props.sender ? "0px" : "10px"} padding={2} borderRadius={7} overflow="auto" width="fit-content">
                        {props.text}
                    </Text>
                    </MenuButton>
                </Flex>
                <MenuList>
                    <MenuItem onClick={() => copyToClipboard(props.text)}>Copy</MenuItem>
                    {props.sender && <MenuItem onClick={() => deleteMessage(props.chatId, props.id)}>Delete</MenuItem>}
                </MenuList>
            </Menu>
        </HStack>

    )
}

export default Message;