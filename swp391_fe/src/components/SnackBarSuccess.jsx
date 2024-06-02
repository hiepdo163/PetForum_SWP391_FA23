import { Alert, Snackbar, styled } from "@mui/material";
import React from "react";

const SnackBarSuccess = ({ openSnackBar, handleOnCloseSnackBar, message }) => {
  return (
    <Snackbar
      style={{ marginTop: "11vh" }}
      open={openSnackBar}
      autoHideDuration={6000}
      onClose={handleOnCloseSnackBar}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <StyledSuccessAlert
        onClose={handleOnCloseSnackBar}
        severity="success"
        sx={{ width: "100%" }}
      >
        {message}
      </StyledSuccessAlert>
    </Snackbar>
  );
};

const StyledSuccessAlert = styled(Alert)`
  background-color: green;
  top: 12vh;
  color: white;
  & .MuiAlert-icon {
    color: white;
  }
`;

export default SnackBarSuccess;
