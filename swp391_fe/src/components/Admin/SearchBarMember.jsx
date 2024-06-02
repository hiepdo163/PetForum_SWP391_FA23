import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export const SearchBarMember = ({
  searchContent,
  selectedRole,
  setSearchContent,
  setSelectedRole,
}) => {
  const [selectedInvoiceDate, setSelectedInvoiceDate] = useState("");
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState("");

  const handleSearchChange = (event) => {
    setSearchContent(event.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleInvoiceDateChange = (event) => {
    setSelectedInvoiceDate(event.target.value);
  };

  const handleInvoiceStatusChange = (event) => {
    setSelectedInvoiceStatus(event.target.value);
  };

  const handleClearFilters = () => {
    setSearchContent("");
    setSelectedRole("");
    setSelectedInvoiceDate("");
    setSelectedInvoiceStatus("");
  };

  return (
    <SearchBarContainer>
      <FilterContainer>
        <FilterTitle>Search Filters</FilterTitle>
        <TextInput
          label="Search"
          variant="outlined"
          value={searchContent}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <SelectContainer>
          <SelectOutlined variant="outlined">
            <InputLabel>Select Role</InputLabel>
            <Select
              label="Select Role"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Member">Member</MenuItem>
            </Select>
          </SelectOutlined>

          <SelectOutlined variant="outlined">
            <InputLabel>Invoice Date</InputLabel>
            <Select
              label="Invoice Date"
              value={selectedInvoiceDate}
              onChange={handleInvoiceDateChange}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="lastWeek">Last Week</MenuItem>
              <MenuItem value="lastMonth">Last Month</MenuItem>
            </Select>
          </SelectOutlined>

          <SelectOutlined variant="outlined">
            <InputLabel>Invoice Status</InputLabel>
            <Select
              label="Invoice Status"
              value={selectedInvoiceStatus}
              onChange={handleInvoiceStatusChange}
            >
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </SelectOutlined>
        </SelectContainer>

        <ClearFiltersButton
          style={{ color: "#4a785f", borderColor: "#4a785f" }}
          variant="outlined"
          onClick={handleClearFilters}
        >
          Clear Filters
        </ClearFiltersButton>
      </FilterContainer>
    </SearchBarContainer>
  );
};

const SearchBarContainer = styled("div")({
  background: "#fff",
  padding: "20px",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});

const TextInput = styled(TextField)({
  width: "100%",
  marginBottom: "10px",
});

const FilterContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  gap: "20px",
  flexWrap: "wrap",
  alignItems: "center",
});

const FilterTitle = styled("div")({
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: "10px",
  flexBasis: "100%",
});

const SelectContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "row",
  width: "100%",
});

const SelectOutlined = styled(FormControl)({
  width: "30%",
  marginBottom: "10px",
});

const ClearFiltersButton = styled(Button)({
  marginLeft: "auto",
});
