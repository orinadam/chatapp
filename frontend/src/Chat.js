import {   Box,
    Heading,
    Text,
    Flex,
    Avatar,
    Icon,
    HStack,
    Spacer,
    Textarea,
    Button,
    VStack, } from "@chakra-ui/react";

import { chatsActions } from "./ChatAppAPI";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedChat, chatMessgesState, connectedUser } from "./store";
import Message from './Message'
import {ErrorBoundary} from 'react-error-boundary'
import { useState, useEffect, forwardRef, Suspense, Fragment } from "react";
import ResizeTextarea from "react-textarea-autosize";
import { ReactComponent as Send } from "./send.svg";

function ErrorFallback({error, resetErrorBoundary}) {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }

const Chat = () => {
    const chat = useRecoilValue(chatMessgesState);
    const user = useRecoilValue(connectedUser);
    const chatDesc = useRecoilValue(selectedChat);
    const [message, setMessage] = useState("");

    const sendMessage = async () => {
      await chatsActions.sendMessage('', {text: message}, chatDesc.chatId);
      setMessage("");
    }
    
    return (  
        <Fragment>
            
        <Flex h="82%" bg="gray.200" w="100%" border="3px solid gray.500" borderRadius={10, 0, 0, 0} display="column">
            <HStack w="100%" h="14%" bg="gray.300">
            <Avatar
                src=""
                bg="gray.400"
                size="md"
                marginTop={-1.9}
                ml={3}
            />

            <Text
                isTruncated
                fontSize="xl"
                fontWeight="bold"
                cursor="pointer"
                style={{ WebkitUserSelect: "none" }}
            >
                {chatDesc.username}
            </Text>
            </HStack>
            <VStack h="85%" overflow="auto">
                {chat.success.messages.map(message => 
                  <Message sender={user.userId == message.sender} text={message.text} />
                )}

            </VStack>
            </Flex>
            <Flex w="100%" >
                <AutoResizeTextarea value={message} onChange={(e) => setMessage(e.target.value)} ></AutoResizeTextarea>
                <Button bg="#0077ff" marginLeft={4} onClick={sendMessage}>
                      <Send fill="#ffffff" size={20}></Send>
                </Button>
            </Flex>
            </Fragment>

        )

}

export const AutoResizeTextarea = forwardRef((props, ref) => {
    return (
      <Textarea
        minH="unset"
        overflow="hidden"
        maxH={20}
        w="97%"
        resize="none"
        ref={ref}
        minRows={1}
        placeholder="Type something"
        as={ResizeTextarea}
        {...props}
      />
    );
  });

export default Chat;
