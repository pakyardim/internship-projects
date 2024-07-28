/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const fetchMessages = async () => {
  try {
    axios.defaults.headers.token = localStorage.getItem("token");

    const response = await axios.get(`/messages`);
    return response.data.data;
  } catch (err: any) {
    return err.response.status;
  }
};

export const fetchMessage = async (id: string) => {
  try {
    axios.defaults.headers.token = localStorage.getItem("token");

    const response = await axios.get(`/message/${id}`);
    return response.data.data;
  } catch (err: any) {
    return err.response.status;
  }
};

export const readMessage = async (id: number) => {
  try {
    axios.defaults.headers.token = localStorage.getItem("token");

    const response = await axios.post(`/message/read/${id}`);
    return response.data.data;
  } catch (err: any) {
    return err.response.status;
  }
};

export const deleteMessage = async (id: number) => {
  try {
    axios.defaults.headers.token = localStorage.getItem("token");

    const response = await axios.post(`/message/delete/${id}`);
    return response.data.data;
  } catch (err: any) {
    return err.response.status;
  }
};
