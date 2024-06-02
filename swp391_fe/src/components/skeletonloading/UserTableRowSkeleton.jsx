import React from "react";
import {
  TableRow,
  TableCell,
  Skeleton,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import styled from "@emotion/styled";

const UserTableRowSkeleton = () => {
  return (
    <TableRow>
      <StyledTableCell align="center" width={300}>
        <Skeleton width={250} />
      </StyledTableCell>
      <StyledTableCell align="center" width={300}>
        <Skeleton width={250} />
      </StyledTableCell>
      <StyledTableCell align="center" width={250}>
        <SelectOutlined variant="outlined" style={{ width: "50%" }}>
          <InputLabel>
            <Skeleton width={100} />
          </InputLabel>
          <Select
            label={<Skeleton width={100} />}
            name="roles"
            value=""
            disabled
          >
            <MenuItem value="Admin">
              <Skeleton width={100} />
            </MenuItem>
            <MenuItem value="Staff">
              <Skeleton width={100} />
            </MenuItem>
            <MenuItem value="Member">
              <Skeleton width={100} />
            </MenuItem>
          </Select>
        </SelectOutlined>
      </StyledTableCell>
      <StyledTableCell align="center" width={250}>
        <IconButton disabled>
          <Visibility color="success" />
        </IconButton>
        <IconButton disabled>
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

export default UserTableRowSkeleton;
