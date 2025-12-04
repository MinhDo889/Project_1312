import express from "express";
import upload from "../middleware/upload.js";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "../controllers/profile_controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("avatar"), createProfile);

router.get("/:user_id", getProfile);

router.put("/:user_id", verifyToken, upload.single("avatar"), updateProfile);



export default router;
