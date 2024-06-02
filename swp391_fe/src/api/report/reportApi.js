import axios from "axios";

const baseUrl = "https://localhost:7246";

const token = "";

class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const fetchPostReportMonthly = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/Post/monthly`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchTransactionReportMonthly = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/TradingPost/monthly`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchMembershipTransactionMonthly = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/TradingPost/membership/monthly`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchUserReportMonthly = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/User/monthly`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchReportedMonthly = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/reports/reported-posts/monthly`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchProcessingReport = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/reports/reported-posts/processing`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const processingReport = async ({ reportedId, isAccepted }) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/reports/reported-posts/processing/${reportedId}/${isAccepted}`
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};
