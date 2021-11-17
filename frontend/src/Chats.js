import { Box, Heading, Text, Flex } from "@chakra-ui/react";

import { useState, useEffect } from "react";
import {chatsActions} from "./ChatAppAPI";
import ChatIcon from "./ChatIcon";

const Chats = () => {
  const [chats, setChats] = useState([]);
  useEffect(async () => {
    const chatsResp = await chatsActions.getChats();
    if(!(chatsResp.method && chatsResp.method === "login")) {
      setChats(chatsResp.success);
    }
  }, [])
  return (
    <Flex height="100vh" alignItems="start" justifyContent="left" direction="column">
      <Heading>ChatApp</Heading>
      <Flex height="100vh" alignItems="start" justifyContent="left" bg="gray.200" overflow="auto" direction="column">
        {chats.map(chat => {
          return <ChatIcon username= {chat.user.username} lastMessage={chat.user.lastMessage} />
        })}
        
      </Flex>
      
    </Flex>
  );
};

export default Chats;
