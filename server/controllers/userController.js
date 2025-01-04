const User = require("../models/User");

// Get currently logged-in user details
exports.getCurrentUser = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Assuming `req.user.id` is set by the auth middleware
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Add a friend
exports.addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ error: "User not found" });
    }

    user.friends.push(friend._id);
    await user.save();

    res.status(200).json({ message: "Friend added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get mutual friends
exports.getMutualFriends = async (req, res) => {
  try {
    const { userId } = req.params; // The selected user
    const currentUserId = req.user.id; // Logged-in user

    // Fetch both users
    const currentUser = await User.findById(currentUserId).populate('friends');
    const selectedUser = await User.findById(userId).populate('friends');

    if (!currentUser || !selectedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find mutual friends
    const mutualFriends = currentUser.friends.filter(friend => selectedUser.friends.includes(friend._id));

    res.status(200).json({
      mutualFriends: mutualFriends,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get common interest-based friend recommendations
exports.getCommonInterestRecommendations = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Logged-in user
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming that the user profile has an 'interests' field (array of interests)
    const commonInterestRecommendations = await User.find({
      interests: { $in: currentUser.interests },
      _id: { $ne: currentUserId }, // Exclude the current user
    });

    res.status(200).json({
      recommendations: commonInterestRecommendations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Display all recommendations on the user's dashboard
exports.getAllRecommendations = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Logged-in user
    const currentUser = await User.findById(currentUserId).populate('friends');

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find mutual friends
    const mutualFriends = currentUser.friends.filter(friend => selectedUser.friends.includes(friend._id));

    // Get common interest recommendations
    const commonInterestRecommendations = await User.find({
      interests: { $in: currentUser.interests },
      _id: { $ne: currentUserId }, // Exclude the current user
    });

    // Combine both recommendations
    const recommendations = {
      mutualFriends: mutualFriends,
      commonInterests: commonInterestRecommendations,
    };

    res.status(200).json({
      recommendations: recommendations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
