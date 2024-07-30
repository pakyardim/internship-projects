import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { findById } from "../services/users";
import { fetchBlacklistedTokens } from "../services/blacklistedTokens";
import { UserType } from "../types";

interface AuthenticatedRequest extends Request {
  user?: UserType;
}

export default (async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).send({ error: "User is not authenticated" });
      return false;
    }

    const jwtTokenPayload: JwtPayload = jwt.verify(
      token as string,
      process.env.JWT_SECRET_KEY
    ) as JwtPayload;

    const blacklistedTokens = await fetchBlacklistedTokens();

    if (blacklistedTokens.includes(token as string)) {
      res.status(401).send({ error: "User is not authenticated" });
      return false;
    }

    const existingUser = await findById(jwtTokenPayload.id);

    if (!existingUser) {
      res.status(401).send({ error: "User is not authenticated" });
      return false;
    }

    req.user = existingUser;
    next();
  } catch (error) {
    next(error);
  }
}) as RequestHandler;
