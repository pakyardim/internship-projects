import express from "express";

import userRoutes from "./users";
import countryRoutes from "./countries";
import messageRoutes from "./messages";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/messages", messageRoutes);
router.use("/countries", countryRoutes);

export default router;
