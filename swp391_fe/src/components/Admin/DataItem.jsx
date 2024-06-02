import React from "react";
import { styled } from "@mui/material/styles";
import { Typography, Grid, Box, Paper } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BlogIcon from "../../img/icon/icons8-blog-64.png";
import UserIcon from "../../img/icon/icons8-user-94.png";
import TransactionIcon from "../../img/icon/icons8-transaction-64.png";
import ReportIcon from "../../img/icon/icons8-warning-100.png";
import MoneyIcon from "../../img/Stack of money and gold coins 3d cartoon style icon.jpg";

const ImgContainer = styled("img")({
  width: "25%",
  height: "25%",
  objectFit: "contain",
});

const labelList = ["Users", "Posts", "Transactions", "Reports", "Membership"];

const DataItem = ({
  label,
  value,
  difference,
  percentageChange,
  isIncrease,
}) => {
  const Icon = isIncrease ? TrendingUpIcon : TrendingDownIcon;
  const color = isIncrease ? "success" : "error";
  const iconMap = {
    [labelList[0]]: UserIcon,
    [labelList[1]]: BlogIcon,
    [labelList[2]]: TransactionIcon,
    [labelList[3]]: ReportIcon,
    [labelList[4]]: MoneyIcon,
  };

  return (
    <GridItem item xs={12} sm={6} md={2}>
      <ChartContainer>
        <DataContainer>
          <IconContainer>
            <Icon color={color} />
          </IconContainer>
          <Typography variant="h6">{value}</Typography>
          <PercentageChangeTypography>
            {difference > 0 ? "+" : ""}
            {isNaN(percentageChange) ? 0 : percentageChange}%
          </PercentageChangeTypography>
          <ImgContainer src={iconMap[label]} />
        </DataContainer>
      </ChartContainer>
    </GridItem>
  );
};

const GridItem = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  margin: ".5rem",

  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#FFFFFF",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
}));

const DataContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const PercentageChangeTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.text.secondary,
}));

export default DataItem;
