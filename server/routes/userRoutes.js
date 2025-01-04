const express = require("express");
const {
  getUsers,
  addUser,
  addFriend,
  getCurrentUser,
  getAllRecommendations,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const friendRequestRoutes = require("./friendRequestRoutes");

const router = express.Router();

// User routes
router.get("/", authMiddleware, getUsers);
router.post("/add", addUser);
router.post("/add-friend", authMiddleware, addFriend);

// Get currently logged-in user details
router.get("/me", authMiddleware, getCurrentUser);

// Friend request routes
router.use("/friend-requests", friendRequestRoutes);

// Recommendations
router.get("/recommendations", authMiddleware, getAllRecommendations);

module.exports = router;
