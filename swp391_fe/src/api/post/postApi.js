import axios from "axios";
import Cookies from "js-cookie";

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

// export const fetchPostData = async () => {
//   try {
//     const response = await axios.get(`${baseUrl}/api/Post?page=1&pageSize=10&sortOrder=desc`);
//     if (response.status === 200) return response.data;
//   } catch (error) {
//     throw new CustomError(error.response.status, error.response.data.errors);
//   }
// };

export const fetchPostData = async (categoryId, page, pageSize, sort) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/Post?categoryId=${categoryId}&page=${page}&pageSize=${pageSize}&sortOrder=${sort}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchRelatedThread = async (postId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/Post/related-thread/${postId}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchPostDataById = async (postId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/Post/${postId}`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchTradingPostData = async (
  pageNumber,
  pageSize,
  categoryId,
  name,
  order
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/TradingPost/trading-TradePost?pageNumber=${pageNumber}&pageSize=${pageSize}&categoryId=${categoryId}&name=${name}&order=${order}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchCommentById = async (postId, page) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/Comment/${postId}/${page}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchCommentLength = async (postId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/Comment/${postId}`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const createComment = async (userId, postId, parentId, content) => {
  const token = Cookies.get("jwtToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.post(
      `${baseUrl}/api/Comment/create`,
      {
        userId: userId,
        postId: postId,
        parentId: parentId,
        content: content,
      },
      config
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const updateComment = async (commentId, content) => {
  try {
    const response = await axios.post(`${baseUrl}/api/Comment/update/`, {
      id: commentId,
      content: content,
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/Comment/delete/${commentId}`
    );
    if (response.status === 204) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const getPostVote = async (postId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/Vote/${postId}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const updatePostVote = async (userId, postId) => {
  try {
    const response = await axios.post(`${baseUrl}/api/Vote`, {
      userId: userId,
      postId: postId,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchHookData = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/Post/hook-content`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchTradingPostDetail = async (postId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/TradingPost/trading-TradePost/details/${postId}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchMainCategory = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/Category/main`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchChildCategory = async (mainCategoryId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/Category/child/${mainCategoryId}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const createPost = async (userId, title, content, categoryId) => {
  try {
    const response = await axios.post(`${baseUrl}/api/Post/`, {
      userId: userId,
      title: title,
      content: content,
      categoryId: categoryId,
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/Post/${postId}`);
    if (response.status === 204) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const updatePost = async (postId, title, content, category) => {
  try {
    const response = await axios.post(`${baseUrl}/api/Post/update/`, {
      id: postId,
      title: title,
      content: content,
      category: category,
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const searchPostByTitle = async (
  keyword,
  categoryId,
  page,
  pageSize,
  sortOrder
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/Post/search?keyword=${keyword}&categoryId=${categoryId}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const reportPost = async (userId, postId, reason) => {
  try {
    const response = await axios.post(`${baseUrl}/api/reports/report-post/`, {
      userId: userId,
      postId: postId,
      reason: reason,
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const uploadTradingPost = async (model) => {
  const userId = sessionStorage.getItem("userId");
  try {
    const response = await axios.post(
      `${baseUrl}/api/TradingPost/trading-TradePost/upload`,
      model
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const confirmPostAsSold = async (id) => {
  const userId = sessionStorage.getItem("userId");
  try {
    const response = await axios.post(
      `${baseUrl}/api/TradingPost/trading-TradePost/confirm/${id}`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const fetchPendingTradingPost = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/TradingPost/trading-TradePost/processing`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const processingPendingTradingPostAction = async (model) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/TradingPost/trading-TradePost/processing-action`,
      model
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const UsingPointToGetUploadTurn = async () => {
  const userId = sessionStorage.getItem("userId");
  try {
    const response = await axios.post(`${baseUrl}/api/Post/point/${userId}`);
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};

export const countNumberOfTradingPost = async (categoryId, title) => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/TradingPost/trading-TradePost-Count?categoryId=${categoryId}&title=${title}`
    );
    if (res.status === 200) return res.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};
