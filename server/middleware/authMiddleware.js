const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using JWT_SECRET
    req.user = decoded; // Attach decoded user data to request
    next(); // Proceed to the next middleware or route
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = authMiddleware;
