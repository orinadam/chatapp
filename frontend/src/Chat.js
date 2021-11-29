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

import { chatsActions } from "./ChatAppAPI";

import { constSelector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedChat, chatMessgesState, connectedUser, allMessages } from "./store";
import Message from './Message'
import { ErrorBoundary } from 'react-error-boundary'
import { useState, useEffect, forwardRef, Suspense, Fragment, useRef } from "react";
import ResizeTextarea from "react-textarea-autosize";
import { ReactComponent as Send } from "./send.svg";
import { useCookies } from 'react-cookie';
import { w3cwebsocket as W3CWebSocket } from "websocket";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const Chat = () => {
  const [cookies, setCookie] = useCookies(['jwt']);
  const chat = useRecoilValue(chatMessgesState);
  const user = useRecoilValue(connectedUser);
  const chatDesc = useRecoilValue(selectedChat);
  const [message, setMessage] = useState("");
  const [connection, setConnection] = useState(new W3CWebSocket("ws://localhost:5000"));
  const [messages, setMessages] = useRecoilState(allMessages);
  const messagesEndRef = useRef(null)

  // useEffect(() => {
  // console.log("mes", messagesEndRef.current.scrollIntoView);
  // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  // }, [])

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messagesEndRef.current, messages]);

  //setMessages(curr => { return [...curr, chat.success.messages] });
  /**
   * 
   *  {
   *     op: "MESSAGE_CREATE",
   *     d: {
   *       target: "USER_ID_HERE",
   *       content: "Your message content"
   *     }
   *  }
   * 
   * 
   */


  // useEffect(() => {
  //   connection.onopen = () => {
  //     setConnection(connection);

  //     // Identify to the websocket server
  //     connection.send(JSON.stringify({
  //       op: "IDENTIFY",
  //       d: {
  //         token: cookies.jwt
  //       }
  //     }))

  //   }

  //   connection.onmessage = (m) => {
  //     console.log(m.data)
  //     const parsed = JSON.parse(m.data);
  //     console.log(parsed)

  //     switch (parsed.op) {
  //       case "MESSAGE_CREATE":
  //         setMessages(currentState => {

  //           return [...currentState, parsed.d.message];
  //         });

  //         break;
  //       case "ERROR":
  //         // there was an error with the websocket authentication
  //         // let's just redirect to the homepage
  //         connection.close();
  //         document.location.href = "/"
  //         break;
  //       default:
  //         console.log("unknown op")
  //     }
  //   }

  // }, []);



  const sendMessage = async () => {
    await chatsActions.sendMessage('', { text: message }, chatDesc.chatId);

    // setMessages(curr => {
    //   const userMessages = curr[chat.success.user._id] ? curr[chat.success.user._id] : [];
    //   console.log(userMessages, message)
    //   const messageFormated = { sender: user.userId, text: message, date: new Date(), seen: false };
    //   return ({ ...curr, [chat.success.user._id]: [...userMessages, messageFormated] })
    // })
    setMessage("");
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })

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
        <VStack h="85%" overflowY="auto" w="100%" overflowX="hidden">
          { /* chat.success.messages.map(message =>
            <Message sender={user.userId == message.sender} text={message.text} />
          ) */ }
          {chat.success && messages[chat.success.user._id] && messages[chat.success.user._id].map(message => <Message id={message._id} chatId={chat.success.id} sender={user.userId == message.sender} text={message.text} />)}
          <Box ref={messagesEndRef}></Box>

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
