import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { checkValidationError } from "../utils/validation";
import {
  findByUsername,
  createUser,
  fetchAll,
  findById,
  updateUser,
} from "../services/users";
import { blacklistToken } from "../services/blacklistedTokens";
import { UserType } from "../types";

interface AuthenticatedRequest extends Request {
  user?: UserType;
}

export const addReader: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    checkValidationError(req);
    const { username } = req.body;

    const user: UserType = await findByUsername(username);

    if (user) {
      return res.status(400).send({ error: "Username already exists" });
    }

    await createUser(req.body);

    res.status(201).send({ message: "Reader added successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    checkValidationError(req);

    const users: UserType[] = await fetchAll();

    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    checkValidationError(req);
    const { username, password } = req.body;

    const user: UserType = await findByUsername(username);
    if (!user || user.password !== password) {
      return res
        .status(400)
        .send({ error: "Username or the password is incorrect" });
    }

    const jwtTokenPayload = {
      userId: user.id,
      username: user.username,
    };

    const jwtToken = jwt.sign(jwtTokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).send({ data: { user, token: jwtToken } });
  } catch (error) {
    next(error);
  }
};

export const checkLogin: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as UserType;
    res.status(200).send({ data: user });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    await blacklistToken(token as string);

    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    checkValidationError(req);
    const { id } = req.params;
    const { password, base64Photo } = req.body;

    await updateUser(+id, { password, base64Photo });

    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    checkValidationError(req);
    const { id } = req.params;

    const user: UserType = await findById(parseInt(id));

    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};
