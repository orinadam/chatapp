import { Box, Heading, Text, Flex, Avatar } from "@chakra-ui/react";

import { useState, useEffect } from "react";
import {chatsActions} from "./ChatAppAPI";
import ChatIcon from "./ChatIcon";
import { useHistory } from 'react-router-dom'
import { useRecoilState } from "recoil";
import { chatMessgesState, selectedUser, connectedUser } from "./store";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [user, setUser] = useRecoilState(connectedUser);
  const history =   useHistory();
  useEffect(async () => {
    const chatsResp = await chatsActions.getChats();
    if(!(chatsResp.method && chatsResp.method === "login")) {
      setChats(chatsResp.success);
    }
    else{
      history.push('/login');
    }

  }, [])

  return (
    <Flex height="100vh" alignItems="start" justifyContent="left" direction="column">
      <Heading mb={3}>ChatApp</Heading>
      <Flex height="100vh" alignItems="start" justifyContent="left" bg="gray.200" overflow="auto" direction="column">
        <Box bg="green.300" fontFamily="sans-serif" h={57} width={300} fontSize={30} padding={2} >
          <Avatar src="./default.png" size="md" marginTop={-1.9} marginRight={2} />
          {/*{user.username}*/}
            MAnana
          </Box>
        {chats.map(chat => {
          return <ChatIcon username= {chat.user.username} lastMessage={chat.user.lastMessage} />
        })}
        
      </Flex>
      
    </Flex>
  );
};

export default Chats;
