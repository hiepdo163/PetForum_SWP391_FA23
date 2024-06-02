import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DefaultAvatar from "../img/default.jpg";

function UserPreviewDialog({ user, onClose, handleOnClose }) {
  return (
    <StyledDialog open={onClose} onClose={handleOnClose}>
      <StyledDialogTitle>User Profile Preview</StyledDialogTitle>
      <StyledDialogContent>
        <StyledAvatar
          src={user.imageUrl ? user.imageUrl : DefaultAvatar}
          alt="User Avatar"
        />
        <StyledUserName variant="h6">{`${user.firstName} ${user.lastName}`}</StyledUserName>
        <StyledUserEmail variant="body1">{user.email}</StyledUserEmail>
        <StyledUserRole variant="body2">Role: {user.roles[0]}</StyledUserRole>
      </StyledDialogContent>
    </StyledDialog>
  );
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  backgroundColor: "none",
  borderRadius: theme.shape.borderRadius,
  boxShadow: `${theme.shadows[4]}, ${theme.shadows[4]}`,
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  textShadow: "none",
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: "50%",
  boxShadow: `${theme.shadows[4]}, ${theme.shadows[4]}`,
}));

const StyledUserName = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  marginBottom: theme.spacing(1),
}));

const StyledUserEmail = styled(Typography)(({ theme }) => ({
  marginTop: ".5em !important",
  marginBottom: theme.spacing(1),
}));

const StyledUserRole = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
}));

export default UserPreviewDialog;
