import React from "react";
import { styled } from "@mui/material/styles";
import { Card, CardContent, Typography, Grid } from "@mui/material";
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
import DataItem from "./DataItem";
import { TIME_FILTERS } from "../../enum/Common";
import { getUserDataByTimeFilter } from "../../utils/dataUtils";
import {
  calculateDifference,
  calculatePercentageChange,
} from "../../utils/calculationUtils";
import { useState } from "react";
import {
  fetchLastMonthStatisticDate,
  fetchMonthlyStatisticDate,
  fetchThisWeekStatisticDate,
  fetchTodayStatisticDate,
} from "../../api/statistics/statisticApi";
import { useEffect } from "react";

const ReportChartWithFilter = () => {
  const [thisweekResponse, setThisweekResponse] = useState({
    users: 0,
    posts: 0,
    transactions: 0,
    reports: 0,
    membership: 0,
  });
  const [lastMonthResponse, setLastMonthResponse] = useState({
    users: 0,
    posts: 0,
    transactions: 0,
    reports: 0,
    membership: 0,
  });
  const [todayResponse, setTodayResponse] = useState({
    users: 0,
    posts: 0,
    transactions: 0,
    reports: 0,
    membership: 0,
  });
  const [monthlyResponse, setMonthlyResponse] = useState({
    users: 0,
    posts: 0,
    transactions: 0,
    reports: 0,
    membership: 0,
  });
  const [error, setError] = useState("");

  const fetchThisWeekStatisticDateAsync = async () => {
    await fetchThisWeekStatisticDate()
      .then((res) => {
        setThisweekResponse(res);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const fetchMonthlyStatisticDateAsync = async () => {
    await fetchMonthlyStatisticDate()
      .then((res) => {
        setMonthlyResponse(res);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const fetchLastMonthStatisticDateAsync = async () => {
    await fetchLastMonthStatisticDate()
      .then((res) => {
        setLastMonthResponse(res);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const fetchTodayStatisticDateAsync = async () => {
    await fetchTodayStatisticDate()
      .then((res) => {
        setTodayResponse(res);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  useEffect(() => {
    fetchLastMonthStatisticDateAsync();
    fetchMonthlyStatisticDateAsync();
    fetchThisWeekStatisticDateAsync();
    fetchTodayStatisticDateAsync();
  }, []);

  const data = [
    {
      timeFilter: TIME_FILTERS.TODAY,
      user: todayResponse.users,
      posts: todayResponse.posts,
      transactions: todayResponse.transactions,
      reports: todayResponse.reports,
      membership: todayResponse.membership,
    },
    {
      timeFilter: TIME_FILTERS.THIS_WEEK,
      user: thisweekResponse.users,
      posts: thisweekResponse.posts,
      transactions: thisweekResponse.transactions,
      reports: thisweekResponse.reports,
      membership: thisweekResponse.membership,
    },
    {
      timeFilter: TIME_FILTERS.THIS_MONTH,
      user: monthlyResponse.users,
      posts: monthlyResponse.posts,
      transactions: monthlyResponse.transactions,
      reports: monthlyResponse.reports,
      membership: monthlyResponse.membership,
    },
    {
      timeFilter: TIME_FILTERS.LAST_MONTH,
      user: lastMonthResponse.users,
      posts: lastMonthResponse.posts,
      transactions: lastMonthResponse.transactions,
      reports: lastMonthResponse.reports,
      membership: lastMonthResponse.membership,
    },
  ];

  const handleErrorFromApi = (error) => {
    if (error.status === 401) {
      setError("Unauthorize");
    } else if (error.status === 400) {
      setError(error.message);
    } else {
      setError("It appears that there is a server error.");
    }
  };

  const { user, posts, transactions, reports, membership } =
    getUserDataByTimeFilter(data, TIME_FILTERS.THIS_MONTH);
  const {
    user: lastMonthUsers,
    posts: lastMonthPosts,
    transactions: lastMonthTransactions,
    reports: lastMonthReports,
    membership: lastMonthMembership,
  } = getUserDataByTimeFilter(data, TIME_FILTERS.LAST_MONTH);

  const userDifference = calculateDifference(user, lastMonthUsers);
  const postsDifference = calculateDifference(posts, lastMonthPosts);
  const transactionsDifference = calculateDifference(
    transactions,
    lastMonthTransactions
  );
  const reportsDifference = calculateDifference(reports, lastMonthReports);
  const membershipDifference = calculateDifference(
    membership,
    lastMonthMembership
  );

  const userPercentageChange = calculatePercentageChange(
    userDifference,
    lastMonthUsers
  ).toFixed(2);

  const postsPercentageChange = calculatePercentageChange(
    postsDifference,
    lastMonthPosts
  ).toFixed(2);

  const transactionsPercentageChange = calculatePercentageChange(
    transactionsDifference,
    lastMonthTransactions
  ).toFixed(2);

  const reportsPercentageChange = calculatePercentageChange(
    reportsDifference,
    lastMonthReports
  ).toFixed(2);

  const membershipPercentageChange = calculatePercentageChange(
    membershipDifference,
    lastMonthMembership
  ).toFixed(2);

  return (
    <StyledCard>
      <CardContent>
        <TitleTypography variant="h5">Data Overview</TitleTypography>
        <GridContainer container>
          <DataItem
            label="Users"
            value={user}
            difference={userDifference}
            percentageChange={userPercentageChange}
            isIncrease={userDifference > 0}
          />
          <DataItem
            label="Posts"
            value={posts}
            difference={postsDifference}
            percentageChange={postsPercentageChange}
            isIncrease={postsDifference > 0}
          />
          <DataItem
            label="Transactions"
            value={transactions}
            difference={transactionsDifference}
            percentageChange={transactionsPercentageChange}
            isIncrease={transactionsDifference > 0}
          />
          <DataItem
            label="Reports"
            value={reports}
            difference={reportsDifference}
            percentageChange={reportsPercentageChange}
            isIncrease={reportsDifference > 0}
          />
          <DataItem
            label="Membership"
            value={membership}
            difference={membershipDifference}
            percentageChange={membershipPercentageChange}
            isIncrease={membershipDifference > 0}
          />
        </GridContainer>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={data}
            margin={{ top: 16, right: 16, bottom: 0, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeFilter" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="user"
              fill="#8884d8"
              animationBegin={500}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Bar
              dataKey="posts"
              fill="#82ca9d"
              animationBegin={500}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Bar
              dataKey="transactions"
              fill="#ffc658"
              animationBegin={500}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Bar
              dataKey="reports"
              fill="#ff6f69"
              animationBegin={500}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Bar
              dataKey="membership"
              fill="#4a785f"
              animationBegin={500}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </StyledCard>
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  color: "#333333",
  borderRadius: theme.spacing(2),
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  margin: theme.spacing(2),
}));

const GridContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: "1rem 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export default ReportChartWithFilter;
