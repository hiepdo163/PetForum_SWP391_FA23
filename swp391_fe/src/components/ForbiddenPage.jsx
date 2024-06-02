import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import forbiddenBackground from "../img/forbidden.jpg";

const BodyWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "50vh",
  position: "relative",
  marginBottom: "3rem",
});

const Background = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: `url(${forbiddenBackground})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 1,
  borderRadius: "3rem",
  filter: "blur(2px)",
});

const ContainerWrapper = styled("div")({
  textAlign: "center",
  zIndex: 2,
});

const TitleWrapper = styled(Typography)({
  fontSize: "4rem",
  marginBottom: "2rem",
  color: "#fff",
});

const MessageWrapper = styled(Typography)({
  fontSize: "1.5rem",
  marginBottom: "2rem",
  color: "#fff",
});

const LinkWrapper = styled(Button)({
  backgroundColor: "#4a785f",
  color: "#fff",
  textDecoration: "none",
  border: "1px solid #4a785f",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#4a785f",
  },
});

const ForbiddenPage = () => {
  return (
    <BodyWrapper>
      <Background />
      <ContainerWrapper>
        <TitleWrapper variant="h1" component="h1">
          403
        </TitleWrapper>
        <MessageWrapper variant="h4" component="p">
          Sorry, it's not allowed to go beyond this point!
        </MessageWrapper>
        <LinkWrapper
          variant="contained"
          color="primary"
          component={Link}
          to="/"
        >
          Please, go back this way.
        </LinkWrapper>
      </ContainerWrapper>
    </BodyWrapper>
  );
};

export default ForbiddenPage;
