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
  Chip,
} from "@mui/material";
import {
  fetchPostData,
  fetchMainCategory,
  searchPostByTitle,
} from "../api/post/postApi";
import { getTimePassed, convertDatetime } from "../utils/DateUtils";
import { ELEMENT_PER_PAGE, ROLE_ENUM } from "../enum/Common";
import MessageSquareIcon from "@mui/icons-material/Message";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { SearchOutlined, ClearOutlined } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { PostSkeleton } from "./skeletonloading/PostSkeleton";
import Avatar from "../img/default.jpg";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { cloneDeep } from "lodash";
import { Link } from "react-router-dom";

export const Post = () => {
  // Data
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  // Filter
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalResult, setTotalResult] = useState();

  useEffect(() => {
    fetchData();
  }, [page, selectedCategory, sortOrder, searchText]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response =
        searchText === ""
          ? await fetchPostData(
              selectedCategory,
              page,
              ELEMENT_PER_PAGE,
              sortOrder
            )
          : await searchPostByTitle(
              searchText,
              selectedCategory,
              page,
              ELEMENT_PER_PAGE,
              sortOrder
            );
      const res = await fetchMainCategory();
      searchText === ""
        ? setPosts([...response.posts])
        : setPosts([...response.results]);

      searchText === ""
        ? setTotalResult(response.totalPosts)
        : setTotalResult(response.totalResults);

      setTotalPage(response.totalPages);
      setMainCategories([...res]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/?id=${postId}`);
  };

  const [mainCategories, setMainCategories] = useState([]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleOrderClick = (order) => {
    setSortOrder(order);
    setPage(1);
  };

  const handleTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const location = useLocation();
  useEffect(() => {
    if (location.state !== ""){
      handleCategoryClick(location.state);
    }
  }, [location.state]);

  return (
    <BoxWrapper>
      <BannerWrapper component={Paper} elevation={2}>
        <ThemeProvider theme={theme}>
          <TextField
            variant="filled"
            size="small"
            value={searchText}
            onChange={handleTextChange}
            sx={{
              flex: 1,
              margin: "0 8px",
            }}
            InputProps={{
              startAdornment: <SearchOutlined className="search-icon" />,
              endAdornment: searchText && (
                <ClearOutlined
                  className="clear-icon"
                  onClick={() => setSearchText("")}
                />
              ),
              inputProps: {
                style: { padding: 12 },
              },
            }}
          />
        </ThemeProvider>

        <div className="filter-input">
          <InputLabel>Category</InputLabel>
          <StyledMenuItem
            key="All"
            onClick={() => handleCategoryClick("")}
            value=""
            style={{
              fontWeight: "" === selectedCategory ? "bold" : "normal",
            }}
          >
            All
          </StyledMenuItem>
          {mainCategories.map((category) => (
            <StyledMenuItem
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              value={category.id}
              style={{
                fontWeight:
                  category.id === selectedCategory ? "bold" : "normal",
              }}
            >
              {category.name}
            </StyledMenuItem>
          ))}
        </div>
        <div className="filter-input">
          <InputLabel>Publication Date</InputLabel>
          <StyledMenuItem
            key="desc"
            onClick={() => handleOrderClick("desc")}
            value="desc"
            style={{
              fontWeight: "desc" === sortOrder ? "bold" : "normal",
            }}
          >
            Sort by DESC
          </StyledMenuItem>
          <StyledMenuItem
            key="asc"
            onClick={() => handleOrderClick("asc")}
            value="asc"
            style={{
              fontWeight: "asc" === sortOrder ? "bold" : "normal",
            }}
          >
            Sort by ASC
          </StyledMenuItem>
        </div>
      </BannerWrapper>

      <MainContainer>
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          <>
            <div className="mb-5">
              <div className="w-100 h3 header d-flex flex-row justify-content-between">
                {posts.length > 0 ? (
                  <span style={{ fontSize: "1.5em" }}>
                  {(page - 1) * ELEMENT_PER_PAGE + 1}-
                  {page * ELEMENT_PER_PAGE > totalResult
                    ? totalResult
                    : page * ELEMENT_PER_PAGE}{" "}
                  of {totalResult} results
                </span>
                ) : <span style={{fontSize:"1.5em"}}>There is no post about this category!!!</span>}
              </div>
              <div className="w-100 h-50 post d-flex flex-column gap-2">
                {posts.map(({ user, post, reaction, category }, postIndex) => (
                  <div key={`post-${postIndex}`}>
                    <ContentContainer>
                      <InfoLeftSection>
                        <ImageContainer
                          src={user.imgUrl === null ? Avatar : user.imgUrl}
                          style={
                            user.role === ROLE_ENUM.Member
                              ? { border: "none", padding: "0" }
                              : {}
                          }
                        />
                        <InfoLeftSectionContent>
                          <PostTitle
                            onClick={() => handlePostClick(post.id)}
                            value={post.title}
                          >
                            {post.title.length < 45
                              ? post.title
                              : post.title.substring(0, 42) + "..."}
                          </PostTitle>
                          <TimeStampContainer>
                          <div
                            className="Cate"
                            onClick={() => handleCategoryClick(category.id)}
                          >
                            #{category.name}
                          </div>
                          <div
                            className="Cate"
                            onClick={() =>
                              handleCategoryClick(category.parentId)
                            }
                          >
                            #{category.parentName}
                          </div>
                        </TimeStampContainer>
                        </InfoLeftSectionContent>
                      </InfoLeftSection>

                      <InfoRightSection>
                        <ReactionContainer>
                          <div>
                            <ArrowUpwardIcon />
                            <span>{reaction.vote}</span>
                          </div>
                          <div>
                            <MessageSquareIcon />
                            <span>{reaction.comment}</span>
                          </div>
                        </ReactionContainer>
                        <InfoRightSectionContent>
                          <PassedTime onClick={() => handlePostClick(post.id)}>
                          {getTimePassed(post.date).includes(`day(s) ago`) ? convertDatetime(post.date) : getTimePassed(post.date)}
                          </PassedTime>
                          <UserName>
                            by <span>{user.name}</span>
                          </UserName>
                        </InfoRightSectionContent>
                      </InfoRightSection>
                    </ContentContainer>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {posts.length > 0  && (
          <Pagination
          variant="outlined"
          shape="rounded"
          count={totalPage}
          page={page}
          onChange={(event, value) => setPage(value)}
          renderItem={(item) => (
            <StyledPaginationItem component="div" {...item} />
          )}
          color="primary"
        />
        )}
      </MainContainer>
    </BoxWrapper>
  );
};

const BoxWrapper = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
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

const theme = createTheme({
  palette: {
    primary: {
      main: "#4a785f", // Change the animation color when clicking on the input field
    },
  },
});

const StyledPaginationItem = styled(PaginationItem)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: "#4a785f",
    color: "#fff",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#578069",
  },
}));

const ChildCategoryContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "row",
  width: "100%",
  flexWrap: "wrap",
  alignItems: "center",
  gap: ".5em",
});

const ActiveChildCategoryStyle = {
  color: "#fff",
  backgroundColor: "#4a785f",
  border: "1px solid #ccc",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 2px",
  width: "140px",
};

const DefaultChildCategoryStyle = {
  color: "#4a785f",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 4px",
  width: "140px",
};

const MainContainer = styled("div")({
  display: "flex",
  width: "70%",
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
  font-size: 20px;
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
