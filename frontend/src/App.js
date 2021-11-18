import logo from "./logo.svg";
import "./App.css";
import { Route } from "react-router-dom";
import Login from "./Login";
import Chats from "./Chats";
import { ChakraProvider } from "@chakra-ui/react"
import {RecoilRoot} from "recoil";
import ProtectedRoute from "./ProtectedRoute";
import {CookiesProvider} from "react-cookie"

function App() {
  return (
    <CookiesProvider>
    <ChakraProvider>
      <RecoilRoot>
        <Route exact path="/login">
          <Login />
        </Route>
        <ProtectedRoute exact path="/chats" component={Chats}>
        </ProtectedRoute>
      </RecoilRoot>
    </ChakraProvider>
    </CookiesProvider>
  );
}

export default App;
