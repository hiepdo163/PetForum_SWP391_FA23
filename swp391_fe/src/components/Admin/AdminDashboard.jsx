import React from "react";
import MonthlyReport from "./MonthlyReport";
import ReportChartWithFilter from "./ReportChartWithFilter";
import { styled } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Box>
      <ReportChartWithFilter />
      <MonthlyReport />
    </Box>
  );
};

const Box = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  marginBottom: "3.5em",
});

export default AdminDashboard;
