import axios from "axios";
import Cookies from "js-cookie";

const baseUrl = "https://localhost:7246";

class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const fetchUserData = async () => {
  return axios
    .get(`${baseUrl}/api/User`)
    .then((response) => response.data)
    .catch((error) => error.data);
};

export const addUserData = async (newUser) => {
  const token = Cookies.get("jwtToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.post(`${baseUrl}/api/User`, newUser, config);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const removeUserData = async (userData) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/User/remove/${userData.email}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const updateUserRole = async (userData) => {
  const token = Cookies.get("jwtToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(
      `${baseUrl}/api/User/Update/role/${userData.email}/${userData.role}`,
      {},
      config
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};
