import { Request, Response, NextFunction } from "express";
import { UserType } from "../types";

interface AuthenticatedRequest extends Request {
  user?: UserType;
}

export default (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role_id === 1) {
    next();
  } else {
    res.status(403).send({ error: "User is not authorized." });
  }
};
