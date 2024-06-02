import { Alert, Snackbar, styled } from "@mui/material";
import React from "react";

const SnackBarFailed = ({ openSnackBar, handleOnCloseSnackBar, message }) => {
  return (
    <Snackbar
      open={openSnackBar}
      autoHideDuration={6000}
      onClose={handleOnCloseSnackBar}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <StyledFailureAlert
        onClose={handleOnCloseSnackBar}
        severity="error"
        sx={{ width: "100%" }}
      >
        {message}
      </StyledFailureAlert>
    </Snackbar>
  );
};

const StyledFailureAlert = styled(Alert)`
  background-color: red;
  top: 12vh;
  color: white;
  & .MuiAlert-icon {
    color: white;
  }
`;

export default SnackBarFailed;
