import logo from "./logo.svg";
import "./App.css";
import { Route } from "react-router-dom";
import Login from "./Login";
import Chats from "./Chats";
import { ChakraProvider } from "@chakra-ui/react"
import {RecoilRoot} from "recoil";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <Route exact path="/login">
          <Login />
        </Route>
        <ProtectedRoute exact path="/chats" component={Chats}>
        </ProtectedRoute>
      </RecoilRoot>
    </ChakraProvider>
  );
}

export default App;
