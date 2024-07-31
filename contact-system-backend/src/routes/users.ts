import express from "express";
import { body, param } from "express-validator";

import * as controller from "../controllers/users";
import authentication from "../middleware/authentication";
import authorization from "../middleware/authorization";

const router = express.Router();

router
  .route("/")
  .post(
    authorization,
    [
      body("username").trim().isString().isLength({ min: 1, max: 10 }),
      body("base64Photo").trim().isString().isLength({ min: 1 }),
      body("password").trim().isString().isLength({ min: 1, max: 10 }),
    ],
    controller.addReader
  )
  .get(authorization, controller.getAllUsers);

router.post(
  "/login",
  [
    body("username").trim().isString().isLength({ min: 1, max: 10 }),
    body("password").trim().isString().isLength({ min: 1, max: 10 }),
  ],
  controller.login
);

router.post("/check-login", authentication, controller.checkLogin);

router.post("/logout", authentication, controller.logout);

router
  .route("/:id")
  .put(
    authorization,
    [
      param("id").exists().isInt().toInt(),
      body("username").trim().isString().isLength({ min: 1, max: 10 }),
      body("base64Photo").trim().isString().isLength({ min: 1 }),
      body("password").trim().isString().isLength({ min: 1, max: 10 }),
    ],
    controller.update
  )
  .get(
    authorization,
    param("id").exists().isInt().toInt(),
    controller.getUserById
  );

export default router;
