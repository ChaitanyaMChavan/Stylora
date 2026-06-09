const jwt = require("jsonwebtoken");

// Helper to create errors with status codes
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * @desc    Verify JWT token middleware
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
  try {
    // 1. Check if JWT_SECRET is configured
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured in environment variables");
      throw createError("Internal server configuration error", 500);
    }

    // 2. Read Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createError("Access denied. No token provided.", 401);
    }

    // 3. Validate header format (Bearer <token>)
    if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      throw createError("Access denied. Malformed authorization header.", 401);
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2) {
      throw createError("Access denied. Malformed token.", 401);
    }

    const token = tokenParts[1];
    if (!token) {
      throw createError("Access denied. Token is empty.", 401);
    }

    // 4. Verify JWT token and prevent token parsing crashes
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      // Catch expired or invalid token errors and map to generic message
      const genericMsg = err.name === "TokenExpiredError" 
        ? "Access denied. Token has expired." 
        : "Access denied. Invalid token.";
      throw createError(genericMsg, 401);
    }

    // 5. Validate verified payload structure (Security: Only use verified data)
    if (!decoded || typeof decoded !== "object" || !decoded.userId || !decoded.role) {
      throw createError("Access denied. Invalid token payload.", 401);
    }

    // 6. Attach payload to req.user
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // 7. Proceed to next middleware
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
};
