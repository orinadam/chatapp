import {
  Box,
  Heading,
  Text,
  Flex,
  Avatar,
  Icon,
  HStack,
  Spacer,
  Textarea,
  Button,
  VStack,
} from "@chakra-ui/react";
import { MdAddCircle } from "react-icons/md";
import { useState, useEffect, forwardRef, Suspense } from "react";
import { chatsActions } from "./ChatAppAPI";
import ChatIcon from "./ChatIcon";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import ResizeTextarea from "react-textarea-autosize";
import { chatMessgesState, selectedUser, connectedUser } from "./store";
import { ReactComponent as Send } from "./send.svg";
import Message from './Message'
import {ErrorBoundary} from 'react-error-boundary' 
import Chat from './Chat';

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const Chats = () => {
  const chat = useRecoilValue(chatMessgesState);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useRecoilState(connectedUser);
  console.log(chat, 44)

  const history = useHistory();
  useEffect(async () => {
    const chatsResp = await chatsActions.getChats();
    if (!(chatsResp.method && chatsResp.method === "login")) {
      setChats(chatsResp.success);
    } else {
      history.push("/login");
    }
  }, []);

  return (
    <HStack
      height="100vh"
      alignItems="start"
      justifyContent="left"
      direction="column"
      bg="gray.100"
    >
      <Flex
        height="100vh"
        alignItems="start"
        justifyContent="left"
        bg="gray.200"
        overflow="auto"
        direction="column"
      >
        <Heading mb={3}>ChatApp</Heading>
        <HStack
          bg="green.300"
          fontFamily="sans-serif"
          h={57}
          width={300}
          fontSize={30}
          padding={2}
        >
          <Avatar
            size="md"
            marginTop={-1.9}
            marginRight={2}
          />
          <Text
            isTruncated
            fontSize="xl"
            fontWeight="bold"
            cursor="pointer"
            style={{ WebkitUserSelect: "none" }}
          >
            {user.username}
          </Text>
          <Spacer />
          <Icon as={MdAddCircle}></Icon>
        </HStack>
        {chats.map((chat) => {
          return (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<div>Loading...</div>}>
            <ChatIcon
              chatId={chat.id}
              username={chat.user.username}
              lastMessage={chat.user.lastMessage}
            />
            </Suspense>
            </ErrorBoundary>
          );
        })}
      </Flex> 
      <VStack w="79%">      
      {/*<Flex h={690} bg="gray.200" w="100%" border="3px solid gray.500" borderRadius={10, 0, 0, 0} display="column">
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
      </Flex> */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
      {chat &&
      <Chat />
}
      </Suspense>
      </ErrorBoundary>
      </VStack>
    </HStack>
  );
};

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

export default Chats;
