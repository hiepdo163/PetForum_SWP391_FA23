import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { ArrowDropDown, Logout, AccountCircle } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { clearSessionData } from "../api/user/userApi";
import { useNavigate } from "react-router-dom";

export const LogoutDropdown = ({ onLogin, handleClose, anchorEl }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSessionData();
    handleClose(false);
    onLogin(false);
    navigate("/");
  };

  const onClickUserProfile = () => {
    handleClose(false);
    navigate("/profile");
  };

  return (
    <div style={{ height: "100%" }}>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={onClickUserProfile}>
          <AccountCircleIcon />
          Profile
        </StyledMenuItem>
        <StyledMenuItem onClick={handleLogout}>
          <StyledLogoutIcon />
          Logout
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
};

const StyledMenu = styled(Menu)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  marginTop: theme.spacing(1),
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5, 2),
}));

const StyledLogoutIcon = styled(Logout)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const AccountCircleIcon = styled(AccountCircle)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));
