import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { ColorModeScript } from "@chakra-ui/react";

function ProtectedRoute({ component: Component, ...restOfProps }) {
    const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
    if(cookies.jwt && cookies.jwt !== ""){
      try{
      if(JSON.parse(atob(cookies.jwt.split('.')[1])).exp > Date.now() / 1000) {
        

      } 
    } catch(e){

    }
    }

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        true ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default ProtectedRoute;