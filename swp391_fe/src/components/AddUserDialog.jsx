import React from "react";
import { styled } from "@mui/material/styles";
import {
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";

const AddUserDialog = ({
  newUser,
  onOpenDialog,
  onCloseDialog,
  onChangeValue,
  onSubmitUser,
  error,
}) => {
  return (
    <StyledDialog open={onOpenDialog} onClose={onCloseDialog}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <DialogTextField
          label="First Name"
          name="firstName"
          value={newUser.firstName}
          onChange={onChangeValue}
        />
        <DialogTextField
          label="Last Name"
          name="lastName"
          value={newUser.lastName}
          onChange={onChangeValue}
        />
        <DialogTextField
          label="Email"
          name="emailAddress"
          value={newUser.emailAddress}
          onChange={onChangeValue}
        />
        <DialogTextField
          label="Phone"
          name="phoneNumber"
          value={newUser.phoneNumber}
          onChange={onChangeValue}
        />
        <DialogTextField
          label="Password"
          name="password"
          type="password"
          value={newUser.password}
          onChange={onChangeValue}
        />
        <SelectOutlined variant="outlined">
          <InputLabel>Select Role</InputLabel>
          <Select
            label="Select Role"
            name="roles"
            value={newUser.roles}
            onChange={onChangeValue}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
          </Select>
        </SelectOutlined>
        {error && <ErrorMessage>Error: {error}</ErrorMessage>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onCloseDialog}>Cancel</Button>
        <Button onClick={onSubmitUser} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

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

const DialogTextField = styled(TextField)({
  width: "100%",
});

const SelectOutlined = styled(FormControl)({
  width: "30%",
  marginBottom: "10px",
});

const ErrorMessage = styled("p")({
  color: "red",
  margin: "0 !important",
  padding: "0 !important",
  fontSize: "1.2rem",
});

export default AddUserDialog;
