import logo from "./logo.svg";
import "./App.css";
import { Route } from "react-router-dom";
import Login from "./Login";
import Chats from "./Chats";
import { ChakraProvider } from "@chakra-ui/react"
import {RecoilRoot} from "recoil";
import ProtectedRoute from "./ProtectedRoute";
import {CookiesProvider} from "react-cookie"
import {ErrorBoundary} from 'react-error-boundary'
import { useState, useEffect, forwardRef, Suspense, Fragment } from "react";

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  return (
    <CookiesProvider>
    <ChakraProvider>
      <RecoilRoot>
        <Route exact path="/login">
          <Login />
        </Route>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<div>Loading...</div>}>
        <ProtectedRoute exact path="/chats" component={Chats}>
        
        </ProtectedRoute>
        </Suspense>
        </ErrorBoundary>
      </RecoilRoot>
    </ChakraProvider>
    </CookiesProvider>
  );
}

export default App;
