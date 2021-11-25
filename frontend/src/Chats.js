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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Alert,
  AlertIcon,
  AlertTitle
} from "@chakra-ui/react";
import { MdAddCircle } from "react-icons/md";
import { useState, useEffect, forwardRef, Suspense } from "react";
import { chatsActions } from "./ChatAppAPI";
import ChatIcon from "./ChatIcon";
import { useHistory } from "react-router-dom";
import { constSelector, useRecoilState, useRecoilValue } from "recoil";
import ResizeTextarea from "react-textarea-autosize";
import { chatMessgesState, selectedUser, connectedUser, allMessages } from "./store";
import { ReactComponent as Send } from "./send.svg";
import Message from './Message'
import { ErrorBoundary } from 'react-error-boundary'
import Chat from './Chat';
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

const Chats = () => {

  const chat = useRecoilValue(chatMessgesState);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useRecoilState(connectedUser);
  const [connection, setConnection] = useState(new W3CWebSocket("ws://localhost:5000"));
  const [cookies, setCookie] = useCookies(['jwt']);
  const [messages, setMessages] = useRecoilState(allMessages);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [username, setUsername] = useState('');
  const [error, setError] = useState(false);

  console.log(chat, 44)

  const addChat = async () => {
    try {
      const resp = await chatsActions.createChat('/chat', { getterUsername: username });
      onClose();
    } catch (e) {
      setError(true);

    }

  }

  useEffect(() => {

    console.log(messages)
    connection.onopen = () => {
      setConnection(connection);

      // Identify to the websocket server
      connection.send(JSON.stringify({
        op: "IDENTIFY",
        d: {
          token: cookies.jwt
        }
      }))

    }

    connection.onmessage = (m) => {
      const parsed = JSON.parse(m.data);
      console.log(parsed)

      switch (parsed.op) {
        case "MESSAGE_CREATE":
          setMessages(currentState => {
            const senderId = parsed.d.message.sender;
            const userMessages = currentState[senderId] ? currentState[senderId] : [];
            return ({ ...currentState, [senderId]: [...userMessages, parsed.d.message] });
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
        // setMessages(curr => [...curr, ])
      }
    }
    console.log("abc", chat.success)
    if (chat.success) {
      console.log("sfahkasf")
      const another_user = String(chat.success.user._id);
      // setMessages(curr => [...curr, { String(chat.success.user._id) : chat.success.messages } ])
      setMessages(curr => ({
        ...curr,
        [another_user]: chat.success.messages
      }))
    }

  }, [chat]);

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
        w="25%"
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
          width="100%"
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
          <Icon as={MdAddCircle} onClick={onOpen}></Icon>
        </HStack>
        {chats.map((chatComponent) => {
          //console.log("sfk", chat.success ? messages[chat.success.user._id] : "ajsda", "sfhksfsfhkk", messages)
          let lastUserMessage = "";
          console.log(messages)
          console.log(chatComponent.user.lastMessage, "1122")

          if ((chatComponent.user.lastMessage && chatComponent.user.lastMessage.length > 0) || (messages[chatComponent.user.id] && messages[chatComponent.user.id].length > 0)) {
            let userMessages = "";

            if (chatComponent.user.lastMessage) {
              userMessages = [chatComponent.user.lastMessage];
            }

            if (messages[chatComponent.user.id]) {
              userMessages = messages[chatComponent.user.id];
            }
            lastUserMessage = userMessages[userMessages.length - 1];

            console.log(lastUserMessage)

            if ((messages[chatComponent.user.id]) && lastUserMessage.sender === user.userId) {
              lastUserMessage = "You: " + lastUserMessage.text;
            }
            else if ((messages[chatComponent.user.id])) {
              lastUserMessage = lastUserMessage.text;
            }
          }

          return (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<div>Loading...</div>}>
                <ChatIcon
                  chatId={chatComponent.id}
                  username={chatComponent.user.username}
                  lastMessage={lastUserMessage}
                />
              </Suspense>
            </ErrorBoundary>
          );
        })}
      </Flex>
      <VStack w="79%" h="100%">
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




        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input placeholder="Username" variant="filled" onChange={(e) => setUsername(e.target.value)}></Input>
              {error && (
                <Alert status="error" mb={7}>
                  <AlertIcon />
                  <AlertTitle mr={2}>Invalid username or password</AlertTitle>
                </Alert>
              )}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="ghost" bg="whatsapp.300" color="whitesmoke" onClick={addChat}>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>





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
