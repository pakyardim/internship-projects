/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const fetchUsers = async () => {
  try {
    axios.defaults.headers.token = localStorage.getItem("token");

    const response = await axios.get(`/users`);
    return response.data.data;
  } catch (err: any) {
    return err.response.status;
  }
};
