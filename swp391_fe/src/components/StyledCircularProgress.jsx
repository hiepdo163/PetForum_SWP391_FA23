import { CircularProgress } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";

const CircularProgressContainer = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const StyledCircularProgress = () => {
  return (
    <CircularProgressContainer>
      <CircularProgress />
    </CircularProgressContainer>
  );
};

export default StyledCircularProgress;
