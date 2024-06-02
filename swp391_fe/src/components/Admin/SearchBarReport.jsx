import React from "react";
import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { PROCESSING_STATUS } from "../../enum/Common";

export const SearchBarReport = ({
  reportDate,
  setReportDate,
  processStatus,
  setProcessStatus,
}) => {
  const handleClearFilters = () => {
    setProcessStatus("");
    setReportDate("");
  };

  const handleReportDateChange = (e) => {
    setReportDate(e.target.value);
  };

  const handleProcessStatusChange = (e) => {
    setProcessStatus(e.target.value);
  };

  return (
    <SearchBarContainer>
      <FilterContainer>
        <FilterTitle>Search Filters</FilterTitle>

        <StyledFormControl>
          <InputLabel htmlFor="report-date-select">Report Date</InputLabel>
          <Select
            id="report-date-select"
            value={reportDate}
            onChange={handleReportDateChange}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="lastWeek">Last Week</MenuItem>
            <MenuItem value="lastMonth">Last Month</MenuItem>
          </Select>
        </StyledFormControl>

        <StyledFormControl>
          <InputLabel htmlFor="process-status-select">
            Process Status
          </InputLabel>
          <Select
            id="process-status-select"
            value={processStatus}
            onChange={handleProcessStatusChange}
          >
            <MenuItem value={PROCESSING_STATUS.ACCEPTED}>Accepted</MenuItem>
            <MenuItem value={PROCESSING_STATUS.PENDING}>Pending</MenuItem>
            <MenuItem value={PROCESSING_STATUS.REJECTED}>Cancelled</MenuItem>
          </Select>
        </StyledFormControl>

        <ClearFiltersButton variant="outlined" onClick={handleClearFilters}>
          Clear Filters
        </ClearFiltersButton>
      </FilterContainer>
    </SearchBarContainer>
  );
};

const SearchBarContainer = styled("div")({
  background: "#f7f7f7",
  padding: "20px",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});

const FilterContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px",
});

const FilterTitle = styled("div")({
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "10px",
  flexBasis: "100%",
  textAlign: "center",
});

const StyledFormControl = styled(FormControl)({
  width: "200px",
  marginBottom: "10px",
});

const ClearFiltersButton = styled(Button)({
  marginLeft: "auto",
});
