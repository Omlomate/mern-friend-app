const express = require("express");
const { getUsers, addUser, addFriend } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes with authentication middleware
const friendRequestRoutes = require("./friendRequestRoutes"); // Import friend request routes

const router = express.Router();

// User routes
router.get("/", authMiddleware, getUsers);
router.post("/add", addUser);
router.post("/add-friend", addFriend);

// Friend request routes
router.use("/friend-requests", friendRequestRoutes); // Add friend request routes here

module.exports = router;
