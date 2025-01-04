const express = require("express");
const { sendFriendRequest, getFriendRequests, acceptFriendRequest, removeFriendRequest } = require("../controllers/friendRequestController");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes with authentication middleware

const router = express.Router();

// Send a friend request
router.post("/send", authMiddleware, sendFriendRequest);

// Get all friend requests for the logged-in user
router.get("/", authMiddleware, getFriendRequests);

// Accept a friend request
router.post("/accept", authMiddleware, acceptFriendRequest);

// Remove a friend request (either accepted or pending)
router.post("/remove", authMiddleware, removeFriendRequest);

module.exports = router;
