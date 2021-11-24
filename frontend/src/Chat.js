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

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedChat, chatMessgesState, connectedUser } from "./store";
import Message from './Message'
import { ErrorBoundary } from 'react-error-boundary'
import { useState, useEffect, forwardRef, Suspense, Fragment } from "react";
import ResizeTextarea from "react-textarea-autosize";
import { ReactComponent as Send } from "./send.svg";
import { useCookies } from 'react-cookie';

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
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  setMessages(curr => { return [...curr, chat.success.messages] });
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


  useEffect(() => {
    const connection = new W3CWebsocket("ws://localhost:5000");

    connection.onopen = () => {
      setConnection(connection);

      // Identify to the websocket server
      connection.send({
        op: "IDENTIFY",
        d: {
          token: cookies.jwt
        }
      })
    }

    connection.onmessage = (m) => {
      const parsed = JSON.parse(m);

      switch (m.op) {
        case "MESSAGE_CREATE":
          setMessages(currentState => {

            return [...currentState, m.d.content];
          });

          break;
        case "ERROR":
          // there was an error with the websocket authentication
          // let's just redirect to the homepage
          connection.close();
          document.location.href = "/"
          break;
        default:
          console.log("unknown op")
      }
    }
  }, []);

  const sendMessage = async () => {
    await chatsActions.sendMessage('', { text: message }, chatDesc.chatId);
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
        <VStack h="85%" overflow="auto" w="100%">
          { /* chat.success.messages.map(message =>
            <Message sender={user.userId == message.sender} text={message.text} />
          ) */ }
          {messages.map(message => <Message sender={user.userId == message.sender} text={message.text} />
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
