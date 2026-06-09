const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Route: Register user
// Access: Public
router.post("/register", registerUser);

// Route: Login user
// Access: Public
router.post("/login", loginUser);

module.exports = router;
