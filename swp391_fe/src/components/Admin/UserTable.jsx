import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
  IconButton,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StyledCircularProgress from "../StyledCircularProgress";
import {
  fetchUserData,
  addUserData,
  removeUserData,
  updateUserRole,
} from "../../api/admin/adminApi";
import UserPreviewDialog from "../UserPreviewDialog";
import UserTableRow from "../UserTableRow";
import AddUserDialog from "../AddUserDialog";
import ConfirmAddUserDialog from "../ConfirmAddUserDialog";
import UserTableRowSkeleton from "../skeletonloading/UserTableRowSkeleton";
import SnackBarSuccess from "../SnackBarSuccess";

const UserTable = ({ searchData, roleData }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
    password: "",
    imageUrl: "",
    roles: [],
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [userSize, setUserSize] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserData();
      setFilteredUsers(data);
      setUserData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  const fetchNewUser = async () => {
    await addUserData(newUser)
      .then((res) => {
        fetchData();
        handleClearNewUserData();
        setOpenDialog(false);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const removeUser = async (userData) => {
    await removeUserData(userData)
      .then((res) => {
        fetchData();
        handleOnCloseConfirmationDialog();
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const editRole = async (editedRequest) => {
    await updateUserRole(editedRequest)
      .then((res) => {
        fetchData();
        setOpenSnackBar(true);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const handleErrorFromApi = (error) => {
    if (error.status === 401) {
      setError("Unauthorize");
    } else if (error.status === 400) {
      setError(error.message);
    } else {
      setError("It appears that there is a server error.");
    }
    handleClearNewUserData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = userData;
    if (searchData && searchData.length > 0) {
      filtered = filtered.filter((user) => {
        let name = user.firstName + " " + user.lastName;
        return name.toLowerCase().includes(searchData.toLowerCase());
      });
      console.log(userData);
    }
    if (roleData && roleData.length > 0) {
      filtered = filtered.filter((user) => user.roles.includes(roleData));
    }
    setUserSize(filtered.length);
    const startIndex = (page - 1) * 5;
    const endIndex = startIndex + 5;
    setFilteredUsers(filtered.slice(startIndex, endIndex));
  }, [searchData, roleData, userData, page]);

  const handleAddUser = () => {
    fetchNewUser();
  };

  const handleClearNewUserData = () => {
    setNewUser({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      emailAddress: "",
      password: "",
      imageUrl: "",
      roles: [],
    });
  };

  const handleClearError = () => {
    setError(null);
  };

  const handleDeleteUser = () => {
    removeUser(filteredUsers[selectedUser]);
  };

  const handlePreviewUser = (index) => {
    setSelectedUser(index);
    setIsPreviewVisible(true);
  };

  const handleOnClosePreviewUser = (index) => {
    setIsPreviewVisible(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    handleClearNewUserData();
    handleClearError();
  };

  const handleInputChange = (event) => {
    setNewUser((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    handleClearError();
  };

  const handleOpenConfirmationDialog = (index) => {
    setOpenConfirmationDialog(true);
    setSelectedUser(index);
  };

  const handleOnCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const handleOnCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
    setSelectedUser(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleEditRole = (e, index) => {
    let user = filteredUsers[index];
    let stringRole = e.target.value;
    let email = user.email;
    editRole({
      email: email,
      role: stringRole,
    });
  };

  return (
    <div>
      <IconButtonContainer>
        <TableTitle>User ({filteredUsers.length})</TableTitle>
        <FlexContainer>
          <IconButton aria-label="add" onClick={handleDialogOpen}>
            <AddIcon />
          </IconButton>
          <Pagination
            count={Math.ceil(userSize / 5)}
            page={page}
            onChange={(event, newPage) => handlePageChange(event, newPage)}
          />
        </FlexContainer>
      </IconButtonContainer>

      <StyledTableContainer component={Paper}>
        <StyledTable aria-label="User table">
          <StyledTableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={1}>
                Name
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={1}>
                Email
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={1}>
                Role
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={1}>
                Action
              </StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {isLoading ? (
              <>
                <UserTableRowSkeleton />
                <UserTableRowSkeleton />
                <UserTableRowSkeleton />
                <UserTableRowSkeleton />
                <UserTableRowSkeleton />
              </>
            ) : (
              filteredUsers.map((user, index) => (
                <UserTableRow
                  user={user}
                  index={index}
                  onEditRole={handleEditRole}
                  onOpenPreviewDialog={handlePreviewUser}
                  onRemoveUser={handleOpenConfirmationDialog}
                />
              ))
            )}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {openDialog && (
        <AddUserDialog
          newUser={newUser}
          onChangeValue={handleInputChange}
          onCloseDialog={handleDialogClose}
          onOpenDialog={openDialog}
          onSubmitUser={handleAddUser}
          error={error}
        />
      )}

      {openConfirmationDialog && (
        <ConfirmAddUserDialog
          error={error}
          onCloseConfirmationDialog={handleOnCloseConfirmationDialog}
          onOpenConfirmationDialog={openConfirmationDialog}
          onSubmitDeleteUser={handleDeleteUser}
        />
      )}

      {isPreviewVisible && (
        <UserPreviewDialog
          onClose={isPreviewVisible}
          handleOnClose={handleOnClosePreviewUser}
          user={filteredUsers[selectedUser]}
        />
      )}

      <SnackBarSuccess
        handleOnCloseSnackBar={handleOnCloseSnackBar}
        openSnackBar={openSnackBar}
        message={"Update Successfully"}
      />
    </div>
  );
};

const TableTitle = styled("div")({
  fontWeight: "bold",
  textTransform: "uppercase",
  fontSize: "1rem",
});

const IconButtonContainer = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const FlexContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});

const StyledTableContainer = styled(TableContainer)`
  margin-top: 16px;
`;

const StyledTable = styled(Table)`
  min-width: 650px;
`;

const StyledTableHead = styled(TableHead)`
  & th {
    position: relative;
    text-align: center;
    font-weight: bold;
  }

  & th::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-color: rgba(224, 224, 224, 1);
    width: 1px;
    height: 70%;
  }
  background-color: #f5f5f5;
`;

const StyledTableCell = styled(TableCell)`
  font-weight: 300;
  text-align: center;
`;

const StyledSuccessAlert = styled(Alert)`
  background-color: green;
  top: 12vh;
  color: white;
  & .MuiAlert-icon {
    color: white;
  }
`;

export default UserTable;
