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
import { FaCoins } from "react-icons/fa";
import { numberWithCommas } from "../../utils/ArraySplitingUtils";

const PointsCard = ({ MemberShipTransaction }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [points, setPosts] = useState([]);

  const [viewPosts, setViewPosts] = useState([]);
  useEffect(() => {
    setViewPosts(MemberShipTransaction);
  }, []);
  return (
    <BoxWrapper>
      <MainContainer>
        {viewPosts.map((point, index) => (
          <div key={`point-${index}`}>
            <ContentContainer>
              <InfoLeftSection>
                <InfoLeftSectionContent>
                  <PostTitle>
                    <FaCoins /> Trading points have been bought
                  </PostTitle>
                  <TimeStampContainer>
                    <PassedTime>{convertDatetime(point.date)}</PassedTime>
                  </TimeStampContainer>
                </InfoLeftSectionContent>
              </InfoLeftSection>

              <InfoRightSection>
                <InfoRightSectionContent>
                  + {numberWithCommas(point.amount)}
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
  color: #fbb238;
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
  justifyContent: "center",
  alignItems: "center",
  "@media (max-width: 1000px)": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "30%",
  },
});

const InfoRightSectionContent = styled("div")({
  textAlign: "right",
  justifyContent: "flex-end",
  color: "#686c6e",
  fontWeight: "bold",
});

export default PointsCard;
