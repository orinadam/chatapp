import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { ColorModeScript } from "@chakra-ui/react";


function ProtectedRoute({ component: Component, ...restOfProps }) {
    const token = "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"
    let authenticated = false;
    const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
    if(cookies.jwt && cookies.jwt !== ""){
      try{
        const parsed = Buffer.from(cookies.jwt.split('.')[1], "base64").toString("utf-8");
      if(JSON.parse(parsed).exp > Date.now() / 1000) {
        authenticated = true;
        
      } 
      else {
        throw Error("token has expired")
      }
    } catch(e){
      console.log("Error occured");

    }
    }
    else {
      console.log("No such token");
    }

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        authenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default ProtectedRoute;