import axios from "axios";
import Cookies from "js-cookie";

const baseUrl = "https://localhost:7246";

class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const fetchThisWeekStatisticDate = async () => {
  const token = Cookies.get("jwtToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${baseUrl}/api/ReportedStatistics/this-week`,
      config
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchMonthlyStatisticDate = async () => {
  const token = Cookies.get("jwtToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${baseUrl}/api/ReportedStatistics/monthly`,
      config
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchLastMonthStatisticDate = async () => {
  const token = Cookies.get("jwtToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${baseUrl}/api/ReportedStatistics/last-month`,
      config
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchTodayStatisticDate = async () => {
  const token = Cookies.get("jwtToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${baseUrl}/api/ReportedStatistics/today`,
      config
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};
