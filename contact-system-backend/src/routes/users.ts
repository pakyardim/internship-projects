import express from "express";
import { body, param } from "express-validator";

import * as controller from "../controllers/users";
import authentication from "../middleware/authentication";
import authorization from "../middleware/authorization";

const router = express.Router();

router
  .route("/")
  .post(
    [authentication, authorization],
    [
      body("username").trim().isString().isLength({ min: 1, max: 10 }),
      body("base64Photo").trim().isString().isLength({ min: 1 }),
      body("password").trim().isString().isLength({ min: 1, max: 10 }),
    ],
    controller.addReader
  )
  .get([authentication, authorization], controller.getAllUsers);

router.post(
  "/login",
  [
    body("username").trim().isString().isLength({ min: 1, max: 10 }),
    body("password").trim().isString().isLength({ min: 1, max: 10 }),
  ],
  controller.login
);

router.get("/check-login", authentication, controller.checkLogin);

router.post("/logout", authentication, controller.logout);

router
  .route("/by-id/:id")
  .put(
    [authentication, authorization],
    [
      param("id").exists().isInt().toInt(),
      body("base64Photo").trim().isString().isLength({ min: 1 }),
      body("password").trim().isString().isLength({ min: 1, max: 10 }),
    ],
    controller.update
  )
  .get(
    [authentication, authorization],
    param("id").exists().isInt().toInt(),
    controller.getUserById
  );

export default router;
