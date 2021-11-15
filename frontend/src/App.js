import logo from "./logo.svg";
import "./App.css";
import { Route } from "react-router-dom";
import Login from "./Login";
import Chats from "./Chats";

function App() {
  return (
    <div>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/chats">
        <Chats />
      </Route>
    </div>
  );
}

export default App;
