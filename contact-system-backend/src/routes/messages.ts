import express from "express";
import { body, query, param } from "express-validator";

import * as controller from "../controllers/messages";
import authentication from "../middleware/authentication";
import authorization from "../middleware/authorization";

const router = express.Router();

router
  .route("")
  .post(
    [
      body("name").trim().isString().isLength({ min: 1, max: 50 }),
      body("message").trim().isString().isLength({ min: 1, max: 500 }),
      body("country_id").exists().isInt().toInt(),
      body("gender_id").exists().isInt().toInt(),
    ],
    controller.addMessage
  )
  .get(
    authentication,
    [
      (query("skip").exists().isInt().toInt(),
      query("limit").exists().isInt().toInt(),
      query("sort").trim().not().isEmpty()),
    ],
    controller.fetchAll
  );

router.get("/unread", authentication, controller.fetchUnread);

router
  .route("/:id")
  .put(
    authentication,
    param("id").exists().isInt().toInt(),
    controller.readMessage
  )
  .delete(
    authorization,
    param("id").exists().isInt().toInt(),
    controller.deleteMessage
  )
  .get(
    authentication,
    param("id").exists().isInt().toInt(),
    controller.fetchById
  );

export default router;
