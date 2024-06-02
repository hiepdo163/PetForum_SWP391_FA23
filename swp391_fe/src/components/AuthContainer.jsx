import React from "react";
import { Button, Container, styled } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContainer = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const isHomePage = location.pathname === "/login";

  const handleOnClick = (index) => {
    index ? navigation("/login") : navigation("/signup");
  };

  return (
    <StyledContainer>
      <Button
        variant="contained"
        style={isHomePage ? StyledButtonOnUrl : StyledButton}
        onClick={() => handleOnClick(0)}
      >
        Sign Up
      </Button>
      <Button
        variant="contained"
        style={isHomePage ? StyledButton : StyledButtonOnUrl}
        onClick={() => handleOnClick(1)}
      >
        Sign In
      </Button>
    </StyledContainer>
  );
};

const StyledButton = {
  backgroundColor: "#4a785f",
};
const StyledButtonOnUrl = {
  backgroundColor: "#fff",
  color: "black",
};

const StyledContainer = styled(Container)({
  width: "20%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  gap: "2rem",
  marginRight: "unset",
});

export default AuthContainer;
