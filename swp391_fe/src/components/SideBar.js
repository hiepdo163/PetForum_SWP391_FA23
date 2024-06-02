import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Backdrop,
  Collapse,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Analytics,
  ManageAccountsOutlined,
  ExpandMore as ExpandMoreIcon,
  ChevronRight,
  AttachMoney,
  Image,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HelpIcon from "@mui/icons-material/Help";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PremiumIcon from "../img/crown-svgrepo-com.svg";
import { ROLE_ENUM } from "../enum/Common";
import { searchPostByTitle } from "../api/post/postApi";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getTimePassed } from "../utils/DateUtils";

import Avatar from "../img/default.jpg";

export const SideBar = () => {
  const [open, setOpen] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [manageOpen, setManageOpen] = useState(false); // Add state for managing the options
  const userRole = sessionStorage.getItem("userRole");

  const handleToggle = () => {
    setOpen(!open);
    setShowBackdrop(!showBackdrop);
    setManageOpen(false);
  };

  const handleManageToggle = () => {
    setManageOpen(!manageOpen);
  };

  //search by title
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchPost = async (searchValue) => {
    try {
      if (searchValue) {
        const results = await searchPostByTitle(searchValue);
        setSearchResult(results);
      } else {
        setSearchResult([]);
      }
    } catch (error) {
      console.error("Error: ", error);
      setSearchResult([]);
    }
  };

  return (
    <>
      <ChevronButton onClick={handleToggle}>
        {open ? <ChevronLeftIcon /> : <MenuIcon style={{ color: "#fff" }} />}
      </ChevronButton>
      <SidebarWrapper>
        <SidebarDrawer
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: "MuiDrawer-paper",
          }}
        >
          <SidebarHeader>
            <ChevronButton onClick={handleToggle}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </ChevronButton>
          </SidebarHeader>
          <SearchSection>
            <SearchIconWrapper />
            <SearchInput
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => {
                handleSearchPost(e.target.value);
                setSearchValue(e.target.value);
              }}
            />
          </SearchSection>
          {searchResult.length === 0 && searchValue !== "" ? (
            <span>NOT FOUND !!!</span>
          ) : (
            <>
              {searchResult.map((result) => (
                <div className="post-teaser-rl">
                  <div className="textblock-rl">
                    <Link
                      className="post-title-rl"
                      to={`/post/?id=${result.id}`}
                    >
                      {result.title}
                    </Link>
                  </div>
                  <div className="submenu-rl">
                    <div className="head-rl">
                      <Box>
                        <div className="user-info-rl">
                          <div className="nickname-rl">{result.user}</div>
                          <div className="time-rl">
                            , updated:{getTimePassed(result.publishedDate)}
                          </div>
                        </div>
                      </Box>
                    </div>
                  </div>
                </div>
              ))}{" "}
            </>
          )}
          <Sideblock>
            <Title>Menu</Title>
            <List>
              <StyledListItem button component="a" href="/">
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="Questions" />
              </StyledListItem>
              <StyledListItem button component="a" href="/trading-post">
                <ListItemIcon>
                  <AttachMoney />
                </ListItemIcon>
                <ListItemText primary="Trading" />
              </StyledListItem>
              <StyledListItem button component="a" href="/">
                <ListItemIcon>
                  <LocalOfferIcon />
                </ListItemIcon>
                <ListItemText primary="Tags" />
              </StyledListItem>
              <StyledListItem button component="a" href="/">
                <ListItemIcon>
                  <EmojiEventsIcon />
                </ListItemIcon>
                <ListItemText primary="Ranking" />
              </StyledListItem>
            </List>
          </Sideblock>
          {userRole === ROLE_ENUM.Staff ? (
            <Sideblock>
              <Title>Admin Navigator</Title>
              <List>
                <StyledListItem button onClick={handleManageToggle}>
                  {" "}
                  {/* Use onClick to handle the toggle */}
                  <ListItemIcon>
                    <ManageAccountsOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Manage" />
                  {manageOpen ? <ExpandMoreIcon /> : <ChevronRight />}
                </StyledListItem>
                <AnimatedCollapse in={manageOpen}>
                  <List>
                    <StyledListItem button component="a" href="/Manage/Report">
                      <ListItemText primary="Report" />
                    </StyledListItem>
                    <StyledListItem
                      button
                      component="a"
                      href="/manage/trading-post"
                    >
                      <ListItemText primary="Trading Post" />
                    </StyledListItem>
                  </List>
                </AnimatedCollapse>
                <StyledListItem
                  button
                  component="a"
                  href="/membership/purchase"
                >
                  <ListItemIcon>
                    <img src={PremiumIcon} />
                  </ListItemIcon>
                  <ListItemText primary="Premium" />
                </StyledListItem>
              </List>
            </Sideblock>
          ) : userRole === ROLE_ENUM.Admin ? (
            <Sideblock>
              <Title>Admin Navigator</Title>
              <List>
                <StyledListItem button component="a" href="/admin/dashboard">
                  <ListItemIcon>
                    <Analytics />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </StyledListItem>
                <StyledListItem button onClick={handleManageToggle}>
                  {" "}
                  {/* Use onClick to handle the toggle */}
                  <ListItemIcon>
                    <ManageAccountsOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Manage" />
                  {manageOpen ? <ExpandMoreIcon /> : <ChevronRight />}
                </StyledListItem>
                <AnimatedCollapse in={manageOpen}>
                  <List>
                    <StyledListItem button component="a" href="/Manage/User">
                      <ListItemText primary="User" />
                    </StyledListItem>
                    <StyledListItem button component="a" href="/Manage/Report">
                      <ListItemText primary="Report" />
                    </StyledListItem>
                    <StyledListItem
                      button
                      component="a"
                      href="/manage/trading-post"
                    >
                      <ListItemText primary="Trading Post" />
                    </StyledListItem>
                    <StyledListItem button component="a" href="/Manage/Category">
                      <ListItemText primary="Category" />
                    </StyledListItem>
                  </List>
                </AnimatedCollapse>
                <StyledListItem
                  button
                  component="a"
                  href="/membership/purchase"
                >
                  <ListItemIcon>
                    <img src={PremiumIcon} />
                  </ListItemIcon>
                  <ListItemText primary="Premium" />
                </StyledListItem>
              </List>
            </Sideblock>
          ) : (
            userRole === ROLE_ENUM.Member && (
              <Sideblock>
                <Title>Personal Navigator</Title>
                <List>
                  <StyledListItem button component="a" href="/">
                    <ListItemIcon>
                      <HelpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Your questions" />
                  </StyledListItem>
                  <StyledListItem button component="a" href="/">
                    <ListItemIcon>
                      <QuestionAnswerIcon />
                    </ListItemIcon>
                    <ListItemText primary="Your answers" />
                  </StyledListItem>
                  <StyledListItem button component="a" href="/">
                    <ListItemIcon>
                      <FavoriteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Your likes & votes" />
                  </StyledListItem>
                  <StyledListItem
                    button
                    component="a"
                    href="/membership/purchase"
                  >
                    <ListItemIcon>
                      <img src={PremiumIcon} />
                    </ListItemIcon>
                    <ListItemText primary="Premium" />
                  </StyledListItem>
                </List>
              </Sideblock>
            )
          )}
        </SidebarDrawer>
      </SidebarWrapper>
      {showBackdrop && (
        <Backdrop
          style={{ zIndex: "4" }}
          open={showBackdrop}
          onClick={handleToggle}
        />
      )}
    </>
  );
};

const SidebarWrapper = styled("div")({
  display: "flex",
  width: "10px",
});

const SidebarDrawer = styled(Drawer)(({ theme }) => ({
  width: "240px",
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: "20vw",
    zIndex: "5",
  },
}));

const SidebarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const SearchSection = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const SearchIconWrapper = styled(SearchIcon)({
  marginRight: "8px",
});

const SearchInput = styled(TextField)({
  flexGrow: 1,
});

const Sideblock = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
}));

const Title = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: "bold",
  fontSize: "1.2rem",
}));

const ChevronButton = styled(IconButton)({
  alignSelf: "center",
});

const StyledListItem = styled(ListItem)(() => ({
  "&:hover": {
    backgroundColor: "#4a785f",
    color: "#fff",
    "& > *": {
      color: "#fff",
    },
  },
}));

const AnimatedCollapse = styled(Collapse)({
  transition: "height 0.3s ease-in-out;",
});

const Box = styled("div")({
  display: "flex",
  gap: "1rem",
  width: "30%",
});
