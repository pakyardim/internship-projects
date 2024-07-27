/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const fetchMessages = async () => {
  try {
    const response = await axios.get(`/messages`);
    return response.data.data;
  } catch (err: any) {
    return err.response.status;
  }
};
