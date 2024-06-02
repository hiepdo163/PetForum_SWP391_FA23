import React from "react";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const ConfirmAddUserDialog = ({
  onOpenConfirmationDialog,
  onCloseConfirmationDialog,
  error,
  onSubmitDeleteUser,
}) => {
  return (
    <StyledDialog
      open={onOpenConfirmationDialog}
      onClose={onCloseConfirmationDialog}
    >
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>Are you sure you want to delete this user?</DialogContent>
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
      <DialogActions>
        <Button onClick={onCloseConfirmationDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmitDeleteUser} color="primary">
          Delete
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

const ErrorMessage = styled("p")({
  color: "red",
  margin: "0 !important",
  padding: "0 !important",
  fontSize: "1.2rem",
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogTitle-root": {
    fontWeight: "bold",
    fontSize: "1.5rem",
    textShadow: "none",
  },
  "& .MuiTextField-root": {
    marginBottom: theme.spacing(2),
  },
  "& .MuiDialogContent-root": {
    paddingTop: "1rem",
  },
  "& .MuiFormControl-root": {
    marginBottom: theme.spacing(2),
  },
  "& .MuiTypography-root": {
    color: "black",
    marginBottom: theme.spacing(2),
  },
  "& .MuiButton-root:not(:last-child)": {
    marginRight: theme.spacing(1),
  },
}));

export default ConfirmAddUserDialog;
