import logo from "./logo.svg";
import "./App.css";
import { Route } from "react-router-dom";
import Login from "./Login";
import Chats from "./Chats";
import { ChakraProvider } from "@chakra-ui/react"

function App() {
  return (
    <ChakraProvider>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/chats">
        <Chats />
      </Route>
    </ChakraProvider>
  );
}

export default App;
