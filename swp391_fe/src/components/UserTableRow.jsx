import React from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import styled from "@emotion/styled";

const UserTableRow = ({
  user,
  onEditRole,
  onRemoveUser,
  onOpenPreviewDialog,
  index,
}) => {
  return (
    <TableRow key={user.email}>
      <StyledTableCell align="center">
        {user.firstName + " " + user.lastName}
      </StyledTableCell>
      <StyledTableCell align="center">{user.email}</StyledTableCell>
      <StyledTableCell align="center">
        <SelectOutlined variant="outlined" style={{ width: "50%" }}>
          <InputLabel>Select Role</InputLabel>
          <Select
            label="Select Role"
            name="roles"
            value={Array.isArray(user.roles) ? user.roles[0] : user.roles}
            onChange={(e) => onEditRole(e, index)}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
          </Select>
        </SelectOutlined>
      </StyledTableCell>
      <StyledTableCell align="center">
        <IconButton
          aria-label="edit"
          onClick={() => {
            onOpenPreviewDialog(index);
          }}
        >
          <Visibility color="success" />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => onRemoveUser(index)}>
          <DeleteIcon color="error" />
        </IconButton>
      </StyledTableCell>
    </TableRow>
  );
};

const StyledTableCell = styled(TableCell)`
  font-weight: 300;
  text-align: center;
`;

const SelectOutlined = styled(FormControl)({
  width: "30%",
  marginBottom: "10px",
});

export default UserTableRow;
