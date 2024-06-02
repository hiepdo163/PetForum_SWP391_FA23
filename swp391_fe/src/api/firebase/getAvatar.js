import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./storage";
import Avatar from "../../img/default.jpg";
import axios from "axios";

const baseUrl = "https://localhost:7246";

class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const getImageUrl = async ({ __filename, setDefaultAvatar }) => {
  const userId = sessionStorage.getItem("userId");
  const imageRef = ref(storage, `images/avatar/${userId}/${__filename}`);
  getDownloadURL(imageRef)
    .then((url) => {
      setDefaultAvatar(url);
    })
    .catch((error) => {
      setDefaultAvatar(Avatar);
    });
};

export const fetchUserAvatar = async () => {
  const userId = sessionStorage.getItem("userId");
  try {
    const response = await axios.get(`${baseUrl}/api/User/avatar/${userId}`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const postUserAvatar = async (imgUrl) => {
  const userId = sessionStorage.getItem("userId");
  try {
    const response = await axios.post(`${baseUrl}/api/User/update/avatar`, {
      userId: userId,
      imgUrl: imgUrl,
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};
