import express from "express";
import * as controller from "../controllers/countries";

const router = express.Router();

router.get("", controller.fetchAll);

export default router;
