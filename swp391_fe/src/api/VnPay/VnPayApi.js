import axios from "axios";

const baseUrl = "https://localhost:7246";

const token = "";

class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const CreatePaymentUrl = async ({ userId, amount }) => {
  try {
    const response = await axios.post(`${baseUrl}/api/VNPay`, {
      userId: userId,
      amount: amount,
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    throw new CustomError(error.response.status, error.response.data.errors);
  }
};
