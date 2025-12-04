import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  getCurrentUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/me", authenticateToken, getCurrentUser);
router.get("/", authenticateToken, requireRole("admin"), getAllUsers);
router.get("/:id", authenticateToken, requireRole("admin"), getUserById);
router.post("/", authenticateToken, requireRole("admin"), createUser);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteUser);
router.put(
  "/:id/password",
  authenticateToken,
  updatePassword
);

export default router;
