import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Home } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
// import "./Navigation.css";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  "& .MuiBreadcrumbs-separator": {
    color: "#4a785f",
    fontSize: "14px",
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: "#4a785f",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  transition: "color 0.3s ease-in-out",
  "&:hover": {
    color: "#99b3a5",
    textDecoration: "underline",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "1px",
}));

const Navigation = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((item) => item);

  return (
    <StyledBreadcrumbs className="navi-container">
      <StyledLink href="/" color="inherit">
        <Home fontSize="small" />
        <StyledTypography variant="body2">Home</StyledTypography>
      </StyledLink>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return (
          <StyledLink
            key={index}
            href={to}
            color="inherit"
            className="link-style"
          >
            <StyledTypography variant="body2">
              {value.toUpperCase()}
            </StyledTypography>
          </StyledLink>
        );
      })}
    </StyledBreadcrumbs>
  );
};

export default Navigation;
