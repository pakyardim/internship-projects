import { RequestHandler } from "express";
import { fetchAllCountries } from "../services/countries";

export const fetchAll: RequestHandler = async (req, res, next) => {
  try {
    const countries = await fetchAllCountries();
    return res.status(200).json({ countries });
  } catch (error) {
    next(error);
  }
};
