import React from "react";
import "./RightPanel2.css";
import { Image } from "react-bootstrap";
import github from "../img/icon/github.svg";
import ins from "../img/icon/instagram.svg";
import fb from "../img/icon/facebook.svg";
import award from "../img/icon/award-light.svg";
import Avatar from "../img/default.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchPostData, fetchRelatedThread } from "../api/post/postApi";
import MessageSquareIcon from "@mui/icons-material/Message";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { getTimePassed, filterPostsByRecent } from "../utils/DateUtils";
import styled from "@emotion/styled";
import { CalculateRemainingPoint } from "../utils/CalculateRemainingPoint";
import { convertDatetime } from "../utils/DateUtils";
import { FaExchangeAlt } from "react-icons/fa";
import { ProgressBar } from "react-bootstrap";
import { GetMaxPoint } from "../utils/CalculateRemainingPoint";
import { fetchUserPublicProfile } from "../api/user/userApi";
import { calculatePageRange } from "../utils/PaginationUtils";
export const RightPanel2 = ({ postId, starterImgUrl, user }) => {
  const [post, setPost] = useState([]);
  const [filteredPost, setFilterdPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, SetPage] = useState(1);
  const navigate = useNavigate();

  const fetchData = async (postId) => {
    setIsLoading(true);
    await fetchRelatedThread(postId)
      .then((res) => {
        setPost(res);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData(postId);
  }, [postId]);

  useEffect(() => {
    handleFilteredByRecent();
  }, [page, post]);

  const handleFilteredByRecent = () => {
    const { sortedPosts } = filterPostsByRecent(post);
    const { startIndex, endIndex } = calculatePageRange(page, 5);

    const slicePosts = sortedPosts.slice(startIndex, endIndex);
    console.log(sortedPosts);
    setFilterdPost(slicePosts);
  };

  const handleOnNavigate = (id) => {
    navigate(`/public/profile/?id=${id}`);
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  const [userProfile, setUserProfile] = useState({});
  const fetchDataFromAPI = async (userId) => {
    try {
      const res = await fetchUserPublicProfile(userId);
      const userProfile= res.userProfile;
      setUserProfile(userProfile);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  useEffect(() => {fetchDataFromAPI(user.id)})

  return (
    <div className="RightPanel2">
      <div className="Post-author">
        <Image
          className="Rectangle1"
          src={starterImgUrl ? starterImgUrl : Avatar}
        />
        <div className="Nick-name" onClick={() => handleOnNavigate(user.id)}>
          @{user.name ? user.name : "User"}
        </div>
        <div className="Line3"></div>
        <div className="profile-stars">{`${
          userProfile.role
        } || ${CalculateRemainingPoint(userProfile.membershipScore)}`}</div>
        <div className="profile-since">
          {`Since ${convertDatetime(userProfile.createdDate)}`}
        </div>
        <div id="progressbar">
          <FaExchangeAlt />
          <ProgressBar
            striped
            animated
            variant="warning"
            now={userProfile.membershipScore}
            max={GetMaxPoint(userProfile.membershipScore)}
            style={{ height: "5px" }}
            id="main-box-child"
          />
          {userProfile.membershipScore}
        </div>
      </div>

      {filteredPost.length>0 && (
        <div className="Related-threads">
        <div className="Title">Related Threads:</div>
        <div className="Line3"></div>
        {isLoading ? (
          <></>
        ) : (
          filteredPost.map(({ user, post, category, reaction }) => (
            <div className="post-teaser-rl">
              <div className="textblock-rl">
                <Link className="post-title-rl" to={`/post/?id=${post.id}`}>
                  {post.title}
                </Link>
              </div>
              <div className="submenu-rl">
                <div className="activity-rl">
                  <div className="group-2-rl">
                    <div className="reaction-rl">{reaction.vote}</div>
                    <ArrowUpwardIcon />
                  </div>
                  <div className="group-2-rl">
                    <div className="reaction-rl">{reaction.comment}</div>
                    <MessageSquareIcon />
                  </div>
                </div>
                <div className="head-rl">
                  <Box>
                    <img
                      className="avt"
                      src={user.imgUrl === null ? Avatar : user.imgUrl}
                      alt=""
                    />
                    <div className="user-info-rl">
                      <div className="nickname-rl">
                        {user.name ? user.name : "User"}
                      </div>
                      <div className="time-rl">
                        , about {getTimePassed(post.date)}
                      </div>
                    </div>
                  </Box>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      )}
    </div>
  );
};

const Box = styled("div")({
  display: "flex",
  gap: "1rem",
  width: "30%",
});
