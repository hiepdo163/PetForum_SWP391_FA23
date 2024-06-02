import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Image } from "react-bootstrap";
import bell from "../img/icon/bell.svg";
import ellipse from "../img/icon/Ellipse1.svg";
import logo from "../img/logo.png";
import plus_circle from "../img/icon/plus-circle.svg";
import "./Navbar.css";
import { SideBar } from "./SideBar";
import { LogoutDropdown } from "./LogoutDropdown";
import AuthContainer from "./AuthContainer";
import { fetchUserAvatar } from "../api/firebase/getAvatar";
import Avatar from "../img/default.jpg";
import { useState } from "react";
import { Skeleton } from "@mui/material";
import styled from "@emotion/styled";
import ImageBanner from "../img/head-banner.jpg";
import { useNavigate } from "react-router-dom";
import { clearSessionData } from "../api/user/userApi";
import Cookies from "js-cookie";

const NavBar = ({ setIsLogin, isLogin }) => {
  const [profilePicUrl, setProfilePicUrl] = useState(Avatar);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollThreshold, setScrollThreshold] = useState(14);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const checkCookieExpiration = () => {
      const isLoggedIn = Cookies.get("jwtToken");
      const isLoggedInSession = sessionStorage.getItem("userId");
      if (!isLoggedIn && isLoggedInSession) {
        clearSessionData();
        setIsLogin(false);
        navigate(`/login`);
      }
    };

    checkCookieExpiration();

    const interval = setInterval(() => {
      checkCookieExpiration();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("storage", () => {
      const imgUrl = localStorage.getItem("img-url");
      if (!imgUrl) return;
      setProfilePicUrl(imgUrl);
    });
  }, []);

  useEffect(() => {
    if (isLogin) {
      setIsLoading(true);
      fetchUserAvatarAsync();
    }
  }, [isLogin]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleScroll = () => {
    const navbar = document.getElementById("nav");
    const scrollPosition = window.pageYOffset;
    const scrollThresholdPx = (scrollThreshold / 100) * window.innerHeight;

    if (scrollPosition > scrollThresholdPx) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  const fetchUserAvatarAsync = async () => {
    try {
      const { imageUrl } = await fetchUserAvatar();
      setIsLoading(false);
      setProfilePicUrl(imageUrl || Avatar);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ zIndex: 999 }}>
      <Navbar
        id="nav"
        className={`containers${isLogin ? "" : " not-logged-in"}`}
      >
        <SideBar />
        <Navbar.Brand>
          <Link
            to="/"
            style={{ backgroundColor: "none", textDecoration: "none" }}
          >
            <div className="logo_style">
              <Image className="logo" src={logo} alt="logo" />
              <StyledLogo
                className="h1"
                style={{ color: "#fff", textDecorationLine: "none" }}
              >
                Pet's Forum
              </StyledLogo>
            </div>
          </Link>
        </Navbar.Brand>
        {isLogin ? (
          <Navbar className="Navbar-right-side">
            <div className="Content-User">
              <Button
                className="ButtonNav"
                style={{ display: "flex" }}
                onClick={() => navigate("/trading-post/upload")}
              >
                <Image className="PlusCircle" src={plus_circle} />
                <div className="AskAQuestion">Ask for a trading</div>
              </Button>
              <Button
                className="ButtonNav"
                style={{
                  display: "flex",
                }}
                onClick={() => navigate("/post/upload")}
              >
                <Image
                  className="PlusCircle"
                  style={{ color: "#fff" }}
                  src={plus_circle}
                />
                <div className="AskAQuestion">Ask a question</div>
              </Button>
              <Nav className="Notificatios">
                <div className="Bell">
                  <Image src={bell} alt="bell" />
                </div>
                <Image src={ellipse} alt="ellipse" className="Ellipse1" />
              </Nav>
              <Nav className="Profile">
                {isLoading ? (
                  <Skeleton variant="circular" width={"4rem"} height={"4rem"} />
                ) : (
                  <Image
                    src={profilePicUrl}
                    alt="ProfilePic"
                    className="ProfilePic"
                    onClick={handleClick}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <LogoutDropdown
                  onLogin={setIsLogin}
                  handleClose={handleClose}
                  anchorEl={anchorEl}
                />
              </Nav>
            </div>
          </Navbar>
        ) : (
          <AuthContainer />
        )}
      </Navbar>
    </div>
  );
};

const StyledLogo = styled("div")`
  font-style: normal;
  letter-spacing: 0.02em;
  font-weight: 800;
  line-height: 150%;
  margin-bottom: 0 !important;
`;

export default NavBar;
