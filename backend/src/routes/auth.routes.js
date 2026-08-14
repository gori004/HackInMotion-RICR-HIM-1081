import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});
router.post("/logout", logoutUser);

export default router;