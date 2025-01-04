const express = require("express");
const { getUsers, addUser, addFriend } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);          // Fetch all users
router.post("/add", addUser);       // Add a new user
router.post("/add-friend", addFriend); // Add a friend

module.exports = router;
