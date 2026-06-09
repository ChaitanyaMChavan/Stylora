const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper to create errors with status codes
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate input types and presence (Security: Prevent MongoDB Query Injection & check missing values)
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      throw createError("Name, email, and password must be strings", 400);
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      throw createError("All fields (name, email, password) are required and cannot be empty", 400);
    }

    // 2. Prevent Denial of Service (DoS) via excessively long inputs
    if (trimmedName.length > 100) {
      throw createError("Name must be less than 100 characters long", 400);
    }
    if (trimmedEmail.length > 255) {
      throw createError("Email must be less than 255 characters long", 400);
    }
    if (trimmedPassword.length > 128) {
      throw createError("Password must be less than 128 characters long", 400);
    }

    // 3. Validate password minimum length
    if (trimmedPassword.length < 6) {
      throw createError("Password must be at least 6 characters long", 400);
    }

    // 4. Normalize email
    const normalizedEmail = trimmedEmail.toLowerCase();

    // 5. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw createError("Please provide a valid email address", 400);
    }

    // 6. Validate role if provided
    if (role !== undefined) {
      if (typeof role !== "string") {
        throw createError("Role must be a string", 400);
      }
      if (!["client", "designer", "admin"].includes(role)) {
        throw createError("Invalid user role", 400);
      }
    }

    // 7. Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw createError("A user with this email already exists", 409);
    }

    // 8. Hash password (10 rounds)
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    // 9. Create user in database
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "client",
    });

    // 10. Send response without password
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input types and presence (Security: Prevent MongoDB Query Injection)
    if (typeof email !== "string" || typeof password !== "string") {
      throw createError("Email and password must be strings", 400);
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw createError("Email and password are required", 400);
    }

    // 2. Prevent DoS via excessively long inputs
    if (trimmedEmail.length > 255) {
      throw createError("Email must be less than 255 characters long", 400);
    }
    if (trimmedPassword.length > 128) {
      throw createError("Password must be less than 128 characters long", 400);
    }

    // 3. Normalize email
    const normalizedEmail = trimmedEmail.toLowerCase();

    // 4. Find user
    const user = await User.findOne({ email: normalizedEmail });

    // Dummy hash for timing attack mitigation (Security check: prevent user enumeration timing attacks)
    const dummyHash = "$2b$10$7XvW7d59b2N70eD9ZtF7eu2X.r.G8K7n4eA7yK15.y72b7aB3x6/q"; // bcrypt hash for "dummy_password"

    let isMatch = false;
    if (user) {
      isMatch = await bcrypt.compare(trimmedPassword, user.password);
    } else {
      // Run comparison against dummy hash to consume similar CPU cycles
      await bcrypt.compare(trimmedPassword, dummyHash);
    }

    // Security: Use generic error message for both incorrect email and incorrect password to prevent user enumeration
    if (!user || !isMatch) {
      throw createError("Invalid email or password", 401);
    }

    // 5. Validate JWT secret availability (Security check: check if JWT_SECRET environment variable is configured)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured in environment variables");
      throw createError("Internal server configuration error", 500);
    }

    // 6. Generate JWT token (Payload: { userId, role }, expires in 2 hours)
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "2h" }
    );

    // 7. Return response without password
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
