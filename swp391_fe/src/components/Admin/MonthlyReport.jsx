import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button, FormControl, Grid, Typography, styled } from "@mui/material";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  fetchMembershipTransactionMonthly,
  fetchPostReportMonthly,
  fetchReportedMonthly,
  fetchTransactionReportMonthly,
  fetchUserReportMonthly,
} from "../../api/report/reportApi";
import { processUserData } from "../../utils/ArraySplitingUtils";
import { useNavigate } from "react-router-dom";
import { clearSessionData } from "../../api/user/userApi";

// const userData = [
//   { name: "Jan", users: 100 },
//   { name: "Feb", users: 150 },
//   { name: "Mar", users: 200 },
//   { name: "Apr", users: 180 },
//   { name: "May", users: 220 },
//   { name: "Jun", users: 170 },
//   { name: "Jul", users: 190 },
//   { name: "Aug", users: 210 },
//   { name: "Sep", users: 160 },
//   { name: "Oct", users: 230 },
//   { name: "Nov", users: 190 },
//   { name: "Dec", users: 200 },
// ];

// //dummy data
// const postData = [
//   { name: "Jan", posts: 200 },
//   { name: "Feb", posts: 250 },
//   { name: "Mar", posts: 180 },
//   { name: "Apr", posts: 220 },
//   { name: "May", posts: 170 },
//   { name: "Jun", posts: 190 },
//   { name: "Jul", posts: 210 },
//   { name: "Aug", posts: 160 },
//   { name: "Sep", posts: 230 },
//   { name: "Oct", posts: 190 },
//   { name: "Nov", posts: 200 },
//   { name: "Dec", posts: 180 },
// ];

// //dummy data
// const transactionData = [
//   { name: "Jan", transactions: 50 },
//   { name: "Feb", transactions: 75 },
//   { name: "Mar", transactions: 60 },
//   { name: "Apr", transactions: 80 },
//   { name: "May", transactions: 55 },
//   { name: "Jun", transactions: 70 },
//   { name: "Jul", transactions: 65 },
//   { name: "Aug", transactions: 90 },
//   { name: "Sep", transactions: 75 },
//   { name: "Oct", transactions: 60 },
//   { name: "Nov", transactions: 70 },
//   { name: "Dec", transactions: 85 },
// ];

// //dummy data
// const reportData = [
//   { name: "Jan", reports: 10 },
//   { name: "Feb", reports: 5 },
//   { name: "Mar", reports: 15 },
//   { name: "Apr", reports: 8 },
//   { name: "May", reports: 12 },
//   { name: "Jun", reports: 6 },
//   { name: "Jul", reports: 9 },
//   { name: "Aug", reports: 11 },
//   { name: "Sep", reports: 7 },
//   { name: "Oct", reports: 14 },
//   { name: "Nov", reports: 8 },
//   { name: "Dec", reports: 10 },
// ];
const MonthlyReport = () => {
  const [selectedDataColumn, setSelectedDataColumn] = useState("users");
  const navigate = useNavigate();

  const [userData, setUserData] = useState([{ name: "", users: 100 }]);
  const [postData, setPostData] = useState([{ name: "", posts: 100 }]);
  const [transactionData, setTransactionData] = useState([
    { name: "", transactions: 100 },
  ]);
  const [reportData, setReportData] = useState([{ name: "", reports: 100 }]);
  const [membershipData, setMembershipData] = useState([
    { name: "", membership: 100 },
  ]);
  const [error, setError] = useState("");

  const handleErrorFromApi = (error) => {
    if (error.status === 401) {
      clearSessionData();
      navigate(`/login`);
    } else if (error.status === 400) {
      setError(error.message);
    } else {
      setError("It appears that there is a server error.");
    }
  };

  const fetchPostReportMonthlyAsync = async () => {
    await fetchPostReportMonthly()
      .then((res) => {
        setPostData(res);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const fetchTransactionReportMonthlyAsync = async () => {
    await fetchTransactionReportMonthly()
      .then((res) => {
        setTransactionData(res);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const fetchMembershipTransactionMonthlyAsync = async () => {
    await fetchMembershipTransactionMonthly()
      .then((res) => {
        console.log(res);
        setMembershipData(res);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const fetchUserReportMonthlyAsync = async () => {
    await fetchUserReportMonthly()
      .then((res) => {
        setUserData(res);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const fetchReportedMonthlyAsync = async () => {
    await fetchReportedMonthly()
      .then((res) => {
        setReportData(res);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const processedData = processUserData(
    userData,
    postData,
    transactionData,
    reportData,
    membershipData
  );

  // const processedData = userData.map((user, index) => {
  //   return {
  //     name: user.name,
  //     users: user.users,
  //     posts: postData[index].posts,
  //     transactions: transactionData[index].transactions,
  //     reports: reportData[index].reports,
  //   };
  // });

  useEffect(() => {
    fetchPostReportMonthlyAsync();
    fetchTransactionReportMonthlyAsync();
    fetchUserReportMonthlyAsync();
    fetchReportedMonthlyAsync();
    fetchMembershipTransactionMonthlyAsync();
  }, []);

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setSelectedDataColumn(value);
  };

  return (
    <>
      <StyledGrid container>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <TitleTypography variant="h5">Monthly Data</TitleTypography>

              <StyledFormControl>
                <StyledButton
                  variant="contained"
                  value="users"
                  onClick={handleFilterChange}
                  active={selectedDataColumn === "users"}
                >
                  Users
                </StyledButton>
                <StyledButton
                  variant="contained"
                  value="posts"
                  onClick={handleFilterChange}
                  active={selectedDataColumn === "posts"}
                >
                  Posts
                </StyledButton>
                <StyledButton
                  variant="contained"
                  value="transactions"
                  onClick={handleFilterChange}
                  active={selectedDataColumn === "transactions"}
                >
                  Transactions
                </StyledButton>
                <StyledButton
                  variant="contained"
                  value="reports"
                  onClick={handleFilterChange}
                  active={selectedDataColumn === "reports"}
                >
                  Reports
                </StyledButton>
                <StyledButton
                  variant="contained"
                  value="membership"
                  onClick={handleFilterChange}
                  active={selectedDataColumn === "membership"}
                >
                  Membership
                </StyledButton>
              </StyledFormControl>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar
                    dataKey={selectedDataColumn}
                    key={selectedDataColumn}
                    fill="#4a785f"
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </StyledGrid>
    </>
  );
};

export default MonthlyReport;

const StyledButton = styled(Button)`
  && {
    margin-right: 10px;
    background-color: ${(props) => (props.active ? "#4a785f" : "#FFF")};
    color: ${(props) => (props.active ? "#FFF" : "#4a785f")};
    border-radius: 6px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px,
        rgba(0, 0, 0, 0.23) 0px 6px 6px;
    }
  }
`;

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  color: "#333333",
  borderRadius: theme.spacing(2),
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));

const StyledFormControl = styled(FormControl)`
  && {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    flex-direction: row;
    justify-content: flex-end;

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;
