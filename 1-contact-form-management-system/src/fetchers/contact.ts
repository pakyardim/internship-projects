/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

type ContactFormType = {
  name: string;
  gender: string;
  message: string;
  country: string;
};

export const fetchCountries = async () => {
  try {
    const response = await axios.get(`/countries`);
    return response.data.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export const submitContactForm = async (data: ContactFormType) => {
  const response = await axios.post(`/message/add`, data);
  return response.data;
};
