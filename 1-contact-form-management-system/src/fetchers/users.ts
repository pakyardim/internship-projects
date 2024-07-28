/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { UserType } from "src/types";

export const fetchUsers = async () => {
  try {
    axios.defaults.headers.token = localStorage.getItem("token");

    const response = await axios.get(`/users`);
    return response.data.data;
  } catch (err: any) {
    return err.response.status;
  }
};

export const fetchUser = async (id: string | null) => {
  if (!id) return;

  try {
    axios.defaults.headers.token = localStorage.getItem("token");

    const response = await axios.get(`/user/${id}`);
    return response.data.data;
  } catch (err: any) {
    return err.response.status;
  }
};

export const addUser = async (data: UserType) => {
  axios.defaults.headers.token = localStorage.getItem("token");

  const response = await axios.post(`/user/add-reader`, data);
  return response.data.data;
};

export const editUser = async (data: UserType) => {
  axios.defaults.headers.token = localStorage.getItem("token");

  const response = await axios.post(`/user/update/${data.id}`, data);
  return response.data.data;
};
