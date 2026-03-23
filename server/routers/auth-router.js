const express = require("express");
const { register, login, getMe, logout } = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

//http://localhost:5000/api/auth/register
router.post("/register", register);

//http://localhost:5000/api/auth/login
router.post("/login", login);

//http://localhost:5000/api/auth/logout
router.post("/logout", logout);

//http://localhost:5000/api/auth/me
router.get("/me", authMiddleware, getMe);

module.exports = router;
