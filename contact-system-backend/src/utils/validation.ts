import { Request } from "express";
import { validationResult } from "express-validator";

class CustomError extends Error {
  statusCode: number;
}

export const checkValidationError = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    if ("param" in firstError) {
      const message = firstError.param + " " + firstError.msg;
      const error = new CustomError(message);
      error.statusCode = 400;
      throw error;
    }
  }
};
