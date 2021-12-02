import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// private route for authenticated users
const PrivateRoute = ({ children, ...rest }) => {
  const { user } = useAuth0();
  /* essentially we route to rest(which is not a spread operator) and passing the childred intor it, that is the checkour or lease pages else redirect to home */
  return (
    <Route
      {...rest}
      render={() => {
        return user ? children : <Redirect to="/" />;
      }}
    ></Route>
  );
};
export default PrivateRoute;
