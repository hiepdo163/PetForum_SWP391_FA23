import React, { useState, useEffect } from "react";
import {
  Pagination,
  PaginationItem,
  styled,
  TextField,
  MenuItem,
  InputLabel,
  Box,
  Paper,
} from "@mui/material";
import { getTimePassed, convertDatetime } from "../../utils/DateUtils";
import MessageSquareIcon from "@mui/icons-material/Message";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import axios from "axios";
import Avatar from "../../img/default.jpg";
import { useSpring, animated } from "react-spring";
import { ROLE_ENUM } from "../../enum/Common";
import { useNavigate } from "react-router";
const PostCard = ({ CommunityPosts, UserProfile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setViewPosts(CommunityPosts);
  }, [CommunityPosts]);
  const [viewPosts, setViewPosts] = useState([]);

  const handleOnNavigate = (id) => {
    navigate(`/post/?id=${id}`);
  };

  return (
    <BoxWrapper>
      <MainContainer>
        {viewPosts.map(({ user, post, reactions }, index) => (
          <div key={`post-${index}`} onClick={() => handleOnNavigate(post.id)}>
            <ContentContainer>
              <InfoLeftSection>
                <ImageContainer
                  src={
                    UserProfile.imageUrl === null
                      ? Avatar
                      : UserProfile.imageUrl
                  }
                  style={
                    UserProfile.role === ROLE_ENUM.Member
                      ? { border: "none", padding: "0" }
                      : {}
                  }
                />
                <InfoLeftSectionContent>
                  <PostTitle>{post.title}</PostTitle>
                  <TimeStampContainer>
                    <UserName>{UserProfile.name}</UserName>•
                    <PassedTime>{getTimePassed(post.date)}</PassedTime>
                  </TimeStampContainer>
                </InfoLeftSectionContent>
              </InfoLeftSection>

              <InfoRightSection>
                <ReactionContainer>
                  <div>
                    <ArrowUpwardIcon />
                    <span>{reactions.vote}</span>
                  </div>
                  <div>
                  <MessageSquareIcon />
                   <span>{reactions.commentCount}</span>
                  </div>
                </ReactionContainer>
                <InfoRightSectionContent>
                  <PassedTime>{convertDatetime(post.date)}</PassedTime>
                  <UserName>
                    by <span>{UserProfile.name}</span>
                  </UserName>
                </InfoRightSectionContent>
              </InfoRightSection>
            </ContentContainer>
          </div>
        ))}
      </MainContainer>
    </BoxWrapper>
  );
};

const BoxWrapper = styled("div")({
  width: "100%",
  // display: "flex",
  // justifyContent: "space-between",
  // margin: "10px",
});

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: "#FFF",
  "&:hover": {
    backgroundColor: "#4a785f",
    color: "#FFF",
  },
}));

const BannerWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "fit-content",
  justifyContent: "flex-start",
  flexDirection: "column",
  padding: "0.5rem",
  backgroundColor: "#FFF",
  borderRadius: "0.3rem",
  gap: "2rem",
  padding: theme.spacing(2),
}));

const StyledPaginationItem = styled(PaginationItem)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: "#4a785f",
    color: "#fff",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#578069",
  },
}));

const MainContainer = styled("div")({
  display: "flex",
  width: "95%",
  height: "auto",
  flexDirection: "column",
});

const ContentContainer = styled("div")({
  width: "100%",
  height: "fit-content",
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#fff",
  justifyContent: "space-between",
  borderRadius: ".3em",
  padding: ".8em 1.2em",
  cursor: "pointer",
  margin: "10px",

  "&:hover": {
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  },
});

const InfoLeftSection = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: ".5em",
});

const ImageContainer = styled("img")`
  width: 4em;
  height: 4em;
  object-fit: cover;
  border-radius: 1em;
  padding: 0.1em;
  border: 3px solid #4a785f;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const InfoLeftSectionContent = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "column",
  width: "60%",
});

const PostTitle = styled("div")`
  color: #99b3a5;
  font-style: normal;
  letter-spacing: 0.02em;
  font-weight: 800;
  font-size: 16px;
  line-height: 150%;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: #4a785f;
    text-decoration: underline;
  }
`;

const TimeStampContainer = styled("div")`
  display: flex;
  flex-direction: row;
  gap: 0.2em;
  align-items: center;
  text-align: center;
  white-space: nowrap;
`;

const UserName = styled("div")`
  color: #686c6e;
  font-style: normal;
  letter-spacing: 0.02em;
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;
`;

const PassedTime = styled("div")`
  color: #686c6e;
  font-style: normal;
  letter-spacing: 0.02em;
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const InfoRightSection = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "30%",
  "@media (max-width: 1000px)": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "30%",
  },
  "@media (max-width: 900px)": {
    display: "none",
  },
});

const ReactionContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  font-size: 13px;
  color: #383a3b;
  line-height: 20px;
  font-weight: 400;
  gap: 2em;
`;

const InfoRightSectionContent = styled("div")`
  text-align: right;
`;

export default PostCard;
