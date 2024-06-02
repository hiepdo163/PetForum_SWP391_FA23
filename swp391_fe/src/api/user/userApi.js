import axios from "axios";
import Cookies from "js-cookie";

const baseUrl = "https://localhost:7246";

class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const setJwtCookie = (jwt) => {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 15 * 60 * 1000);

  Cookies.set("jwtToken", jwt, { expires: expirationDate });
};

const setJwtSession = (jwt) => {
  sessionStorage.setItem("jwt", jwt);
};

const setUserRoleSession = (role) => {
  sessionStorage.setItem("userRole", role);
};

const setUserIdSession = (id) => {
  sessionStorage.setItem("userId", id);
};

const setUserEmailSession = (email) => {
  sessionStorage.setItem("userEmail", email);
};

const removeJwtSession = () => {
  sessionStorage.removeItem("jwt");
};

const removeUserRoleSession = () => {
  sessionStorage.removeItem("userRole");
};

const removeUserIdSession = () => {
  sessionStorage.removeItem("userId");
};

const removeUserEmailSession = () => {
  sessionStorage.removeItem("userEmail");
};

const removeJwtCookie = () => {
  if (Cookies.get("jwtToken")) Cookies.remove("jwtToken");
};

const handleLoginSuccess = (response) => {
  const { jwt, role, userId, userEmail } = response;
  setJwtSession(jwt);
  setUserRoleSession(role);
  setUserIdSession(userId);
  setUserEmailSession(userEmail);
  setJwtCookie(jwt);
};

export const clearSessionData = () => {
  removeJwtSession();
  removeUserRoleSession();
  removeUserIdSession();
  removeUserEmailSession();
  removeJwtCookie();
};

export const loginUser = async (loginReq) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/Authenticate/Login`,
      loginReq
    );
    if (response.status === 200) {
      handleLoginSuccess(response.data);
      return response.data;
    }
    return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const postSignUp = async (signUpReq) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/Authenticate/Register`,
      signUpReq
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/User/${userId}`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchUserPublicProfile = async (userId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/User/public/details/${userId}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const getRemainingUploadQuantity = async () => {
  const userId = sessionStorage.getItem("userId");
  if (userId == null) return;
  try {
    const response = await axios.get(
      `${baseUrl}/api/TradingPost/trading-TradePost/remaining-quantity/${userId}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const createFeedback = async (content, stars, userId, targetUserId, photoUrl) => {
  try{
    const res = await axios.post(`${baseUrl}/api/Feedback/submit-feedback`, {
      content: content,
      stars: stars,
      userId: userId,
      targetUserId: targetUserId,
      photoUrl: photoUrl,
    })
    if (res.status === 200) return res.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
}

export const fetchFeedbackData = async (page, target) => {
  try{
    const response = await axios.get(`${baseUrl}/api/Feedback/get-feedbacks?targetUserId=${target}&page=${page}&pageSize=3`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
}