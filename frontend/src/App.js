import logo from "./logo.svg";
import "./App.css";
import { Route } from "react-router-dom";
import Login from "./Login";

function App() {
  return (
    <div>
      <Route path="/login">
        <Login />
      </Route>
    </div>
  );
}

export default App;
