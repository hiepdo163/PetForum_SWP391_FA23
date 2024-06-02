import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Typography, Paper, Grid, Container, Box } from "@mui/material";
import { fetchHookData } from "../api/post/postApi";
import Avatar from "../img/default.jpg";
import CategoryIcon from "@mui/icons-material/Category";
import { CATEGORYIMAGE, ROLE_ENUM } from "../enum/Common";
import { useNavigate } from "react-router";

export const RightPanel = () => {
  const [formData, setFormData] = useState({
    topContributors: [],
    communityStaff: [],
    mostDiscussionCategories: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchHookData()
      .then((res) => {
        setFormData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOnNavigate = (id) => {
    navigate(`/public/profile/?id=${id}`);
  };

  return (
    <StyledContainer>
      <BannerWrapper component={Paper} elevation={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StyledTypography variant="h5" gutterBottom>
              Top Contributors
            </StyledTypography>
            {formData.topContributors.map((contributor) => (
              <ContributorContainer key={contributor.id}>
                <ImageContainer
                  src={
                    contributor.imgUrl === null ? Avatar : contributor.imgUrl
                  }
                  style={
                    contributor.role === ROLE_ENUM.Member
                      ? { border: "none", padding: "0" }
                      : {}
                  }
                />
                <InformationContainer>
                  <UserNameStyle
                    variant="button"
                    onClick={() => handleOnNavigate(contributor.id)}
                  >
                    {contributor.name}
                  </UserNameStyle>
                  <Typography variant="body2">
                    {contributor.amount} Replies
                  </Typography>
                </InformationContainer>
              </ContributorContainer>
            ))}
          </Grid>
        </Grid>
      </BannerWrapper>

      <BannerWrapper component={Paper} elevation={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StyledTypography variant="h5" gutterBottom>
              Community Staff
            </StyledTypography>
            {formData.communityStaff.map((staff) => (
              <ContributorContainer key={staff.id}>
                <ImageContainer
                  src={staff.imgUrl === null ? Avatar : staff.imgUrl}
                  style={
                    staff.role === ROLE_ENUM.Member
                      ? { border: "none", padding: "0" }
                      : {}
                  }
                />
                <InformationContainer>
                  <UserNameStyle
                    variant="button"
                    onClick={() => handleOnNavigate(staff.id)}
                  >
                    {staff.name}
                  </UserNameStyle>
                  <Typography variant="body1">
                    {staff.amount} Replies
                  </Typography>
                </InformationContainer>
              </ContributorContainer>
            ))}
          </Grid>
        </Grid>
      </BannerWrapper>

      <BannerWrapper component={Paper} elevation={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StyledTypography variant="h5" gutterBottom>
              Most Discussion Categories
            </StyledTypography>
            {formData.mostDiscussionCategories.map((category) => (
              <CategoryContainer key={category.id}>
                <ImageContainer
                  src={CATEGORYIMAGE[category.category]}
                  style={{ border: "none", padding: "0" }}
                />
                <InformationContainer>
                  <Typography variant="body1">{category.category}</Typography>
                  <Typography variant="body1">
                    {category.amount} Posts
                  </Typography>
                </InformationContainer>
              </CategoryContainer>
            ))}
          </Grid>
        </Grid>
      </BannerWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "fit-content",
  gap: "6rem",
  height: "auto",
  marginBottom: "2rem",
});

const StyledTypography = styled(Typography)({
  color: "#4a785f",
  fontWeight: "700",
});

const BannerWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFF",
  padding: theme.spacing(2),
}));

const ContributorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: ".5em",
  marginBottom: theme.spacing(2),
}));

const ImageContainer = styled("img")`
  width: 4em;
  height: 4em;
  object-fit: cover;
  border-radius: 1em;
  padding: 0.1em;
  border: 3px solid #4a785f;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const CategoryContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: ".5em",
  marginBottom: theme.spacing(2),
}));

const InformationContainer = styled("div")({
  height: "3rem",
  whiteSpace: "nowrap",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  fontSize: "20px !important",
});

const UserNameStyle = styled(Typography)({
  cursor: "pointer",
  "&:hover": {
    fontWeight: "bold !important",
    textDecoration: "underline !important",
  },
});
