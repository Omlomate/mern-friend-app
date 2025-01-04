const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id; // The sender is the logged-in user

    if (senderId === receiverId) {
      return res.status(400).json({ error: "You cannot send a friend request to yourself" });
    }

    // Check if the friend request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    // Create and save the new friend request
    const newRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
    });

    await newRequest.save();
    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all friend requests for the logged-in user
exports.getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all pending friend requests for the user
    const requests = await FriendRequest.find({ receiver: userId, status: "pending" })
      .populate("sender", "name email") // Populate sender's information
      .exec();

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id; // The logged-in user who is accepting the request

    // Find the request
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (request.receiver.toString() !== userId) {
      return res.status(403).json({ error: "You cannot accept this request" });
    }

    // Update the status to 'accepted'
    request.status = "accepted";
    await request.save();

    // Add each other as friends
    const sender = await User.findById(request.sender);
    const receiver = await User.findById(request.receiver);

    sender.friends.push(receiver._id);
    receiver.friends.push(sender._id);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Remove a friend request (either accepted or pending)
exports.removeFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id; // The logged-in user who is removing the request

    // Find the request
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (request.sender.toString() !== userId && request.receiver.toString() !== userId) {
      return res.status(403).json({ error: "You cannot remove this request" });
    }

    // Remove the friend request
    await request.remove();
    res.status(200).json({ message: "Friend request removed" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
