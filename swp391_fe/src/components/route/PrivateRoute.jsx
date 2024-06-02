import React from "react";
import Unauthorized from "../Unauthorized";
import ForbiddenPage from "../ForbiddenPage";

const PrivateRoute = ({ component: Component, roles }) => {
  const userRole = sessionStorage.getItem("userRole");

  if (userRole == null) {
    return <Unauthorized />;
  } else {
    return roles.includes(userRole) ? <Component /> : <ForbiddenPage />;
  }
};

export default PrivateRoute;
