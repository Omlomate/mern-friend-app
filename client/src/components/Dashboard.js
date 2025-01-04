import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa"; // Import a bell icon
import "../Css/Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Fetch user details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/users/me`, { headers });
        setUserData(response.data);
      } catch (error) {
        // Handle error fetching user data
      }
    };

    fetchUserData();
  }, [headers, BACKEND_URL]);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/users`, { headers });
        setAllUsers(response.data);
      } catch (error) {
        // Handle error fetching all users
      }
    };

    fetchAllUsers();
  }, [headers, BACKEND_URL]);

  // Fetch friend requests when the bell icon is clicked
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/friend-requests`, { headers });
      setFriendRequests(response.data);
    } catch (error) {
      // Handle error fetching friend requests
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/friend-requests/accept`,
        { requestId },
        { headers }
      );
      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      // Handle error accepting friend request
    }
  };
  const handleAddFriend = async (userId) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/users/friend-requests/send`,
        { recipientId: userId }, // Send the correct field name
        { headers }
      );
      alert(response.data.message); // Display the response message
    } catch (error) {
      console.error(error); // Log the error for debugging
      alert("Failed to send friend request"); // Inform the user about the failure
    }
  };
  
  return (
    <div>
      <h2>Dashboard</h2>

      {/* User Profile Section */}
      {userData ? (
        <div>
          <h3>Welcome, {userData.name}</h3>
          <p>Email: {userData.email}</p>
          <p>Hobby: {userData.hobby || "No hobby added"}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      {/* Friend Request Bell Icon */}
      <div style={{ position: "relative", cursor: "pointer" }}>
        <FaBell
          size={24}
          onClick={() => {
            setShowFriendRequests((prev) => !prev);
            if (!friendRequests.length && !showFriendRequests) {
              fetchFriendRequests(); // Fetch friend requests when the bell is clicked
            }
          }}
        />
        {friendRequests.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "5px",
              fontSize: "12px",
            }}
          >
            {friendRequests.length}
          </span>
        )}
      </div>

      {/* Friend Requests Section */}
      {showFriendRequests && (
        <div>
          <h3>Friend Requests</h3>
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <div key={request.id}>
                <p>{request.senderName}</p>
                <button onClick={() => handleAcceptRequest(request.id)}>
                  Accept
                </button>
              </div>
            ))
          ) : (
            <p>No friend requests</p>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* All Users Section */}
      <div>
        <h3>All Users</h3>
        {allUsers.length > 0 ? (
          <div className="user-cards-container">
            {allUsers
              .filter(
                (user) =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <div className="user-card" key={user.id} style={userCardStyles}>
                  <div style={cardHeaderStyles}>
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    style={addButtonStyles}
                  >
                    Add Friend
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

// Styles for the user cards and add friend button
const userCardStyles = {
  width: "200px",
  padding: "20px",
  margin: "10px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  display: "inline-block",
  color: "black"
};

const cardHeaderStyles = {
  marginBottom: "10px",
};

const addButtonStyles = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Dashboard;
