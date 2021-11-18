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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedChat, chatMessgesState } from "./store";
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
    console.log(33, chat)
    
    return (  
        <Fragment>
            
        <Flex h={690} bg="gray.200" w="100%" border="3px solid gray.500" borderRadius={10, 0, 0, 0} display="column">
            <HStack w="100%" h="10%" bg="gray.300">
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
                Username
            </Text>
            </HStack>
            <VStack h="85%" overflow="auto">
                <Message sender={true} text="hello"/>
                <Message sender={false} text="hello"/>
                <Message sender={true} text="hello"/>
                <Message sender={false} text="hello"/>
                <Message sender={false} text="hello"/>
                <Message sender={true} text="hello"/>
                <Message sender={false} text="hello"/>
                <Message sender={true} text="hello"/>
                <Message sender={true} text="hello"/>
                <Message sender={false} text="hello"/>
                <Message sender={true} text="hello"/>
                <Message sender={false} text="hello bgdfkljlkf lhfdsdslhg lifdslkdh"/>
                <Message sender={true} text="hello cat gggg"/>
                <Message sender={true} text="hello fjah akhfdaakfsj"/>
                <Message sender={false} text="helloahfskjfskjafs"/>
                <Message sender={true} text="hello afskjfjsk"/>


            </VStack>
            </Flex>
            <Flex w="100%" >
                <AutoResizeTextarea ></AutoResizeTextarea>
                <Button bg="#0077ff" marginLeft={4}>
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
