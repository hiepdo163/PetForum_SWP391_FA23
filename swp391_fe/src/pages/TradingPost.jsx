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
import { fetchTradingPostData, countNumberOfTradingPost, fetchMainCategory } from "../api/post/postApi";
import { getTimePassed, convertDatetime } from "../utils/DateUtils";
import { ELEMENT_PER_PAGE, ROLE_ENUM } from "../enum/Common";
import { SearchOutlined, ClearOutlined, Pages } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PostSkeleton } from "../components/skeletonloading/PostSkeleton";
import Avatar from "../img/default.jpg";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { numberWithCommas } from "../utils/ArraySplitingUtils";
import { cloneDeep } from "lodash";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from '@mui/icons-material/Person';

export const TradingPost = () => {
  // Data
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [viewPosts, setViewPosts] = useState([]);
  // Filter
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [totalResult, setTotalResult] = useState(0);
  const [mainCategories, setMainCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page, selectedCategory, searchText, sortOrder]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchTradingPostData(
        page,
        ELEMENT_PER_PAGE,
        selectedCategory,
        searchText,
        sortOrder
      );
      const res = await fetchMainCategory();
      setMainCategories([...res]);
      fetchTradingPost();

      setPosts([...response]);
      console.log(posts);
      setIsLoading(false);

    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    }
  };

  const fetchTradingPost = async () => {
    try {
      setIsLoading(true);
      const res = await countNumberOfTradingPost(selectedCategory, searchText);
      setTotalResult(res);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const handleTradingPostClick = (postId) => {
    navigate(`/trading-post/details/?id=${postId}`);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  }

  const handleOrderClick = (order) => {
    setSortOrder(order);
    setPage(1);
  }

  const handleTextChange = (title) => {
    setSearchText(title);
    setPage(1);
  };

  return (
    <BoxWrapper>
      <BannerWrapper component={Paper} elevation={2}>
        <ThemeProvider theme={theme}>
          <TextField
            variant="filled"
            size="small"
            value={searchText}
            onChange={(e) => handleTextChange(e.target.value)}
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
          <div className="mb-5">
          {posts.length > 0 ? (
              <span style={{ fontSize: "1.5em" }}>
                {(page - 1) * ELEMENT_PER_PAGE + 1}-
                {page * ELEMENT_PER_PAGE > totalResult
                  ? totalResult
                  : page * ELEMENT_PER_PAGE}{" "}
                of {totalResult} results
              </span>
              ) : <span style={{fontSize:"1.5em"}}>There is no Trading post about this breed!!!</span>}
            <div className="w-100 h-50 post d-flex flex-column gap-2">
              {posts.map(({ user, post, category }, postIndex) => (
                <div key={`post-${postIndex}`}>
                  <ContentContainer>
                    <InfoLeftSection>
                      <ImageContainer
                        src={
                          post.imageUrls === null
                            ? Avatar
                            : post.imageUrls
                        }
                        style={
                          user.role === ROLE_ENUM.Member
                            ? { border: "none", padding: "0" }
                            : {}
                        }
                      />
                      <InfoLeftSectionContent>
                        <div>
                          <PostTitle
                            onClick={() =>
                              handleTradingPostClick(post.id)
                            }
                          >
                            {post.title}
                          </PostTitle>
                          <PriceContainer>
                            {numberWithCommas(post.price)} đ
                          </PriceContainer>
                        </div>
                        <div>
                        <TimeStampContainer>
                        <PetsIcon />
                          <div
                            className="Cate"
                            onClick={() => handleCategoryClick(category.id)}
                          >
                            {category.name}
                          </div>
                        </TimeStampContainer>
                        <TimeStampContainer>
                          <LocationOnIcon />
                          {post.location}
                        </TimeStampContainer>
                        <TimeStampContainer>
                        <PersonIcon/>
                          <UserName>{user.name}</UserName>
                          {/* •<PassedTime >
                            {getTimePassed(post.publicDate).includes(`day(s) ago`) ? convertDatetime(post.publicDate) : getTimePassed(post.publicDate)}
                          </PassedTime> */}
                        </TimeStampContainer>
                        </div>
                      </InfoLeftSectionContent>
                    </InfoLeftSection>
                  </ContentContainer>
                </div>
              ))}
            </div>
          </div>
        )}
        {posts.length > 0 && (
          <Pagination
          variant="outlined"
          shape="rounded"
          count={Math.ceil(totalResult / ELEMENT_PER_PAGE)}
          page={page}
          onChange={(event, value) => setPage(value)}
          renderItem={(item) => (
            <StyledPaginationItem component="div" {...item} />
          )}
          color="primary"
        />
        )}
        <br/>
      </MainContainer>
    </BoxWrapper>
  );
};

const BoxWrapper = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "space-evenly",
  paddingRight: "12rem",
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
  width: 15rem;
  height: 15rem;
  object-fit: cover;
  padding: 0.1em;
`;

const InfoLeftSectionContent = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  flexDirection: "column",
  width: "60%",
});

const PostTitle = styled("div")`
  font-style: normal;
  letter-spacing: 0.02em;
  font-weight: 500;
  font-size: 1.5em;
  line-height: 150%;
`;

const PriceContainer = styled("div")({
  color: "#c90927",
  fontWeight: "bold",
  fontSize: "1.5em",
});

const TimeStampContainer = styled("div")`
  display: flex;
  flex-direction: row;
  gap: 0.2em;
  align-items: center;
  text-align: center;
  font-size: 1em;
  white-space: nowrap;
`;

const UserName = styled("div")`
  color: #686c6e;
  font-style: normal;
  letter-spacing: 0.02em;
  font-weight: 500;
  font-size: 1em;
  line-height: 150%;
`;

const PassedTime = styled("div")`
  color: #686c6e;
  font-style: normal;
  letter-spacing: 0.02em;
  font-weight: 500;
  font-size: 1em;
  line-height: 150%;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

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
