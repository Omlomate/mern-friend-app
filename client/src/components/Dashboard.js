import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa"; // Import a bell icon
import "../Css/Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);

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
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [headers, BACKEND_URL]);

  // Fetch friend requests
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/friend-requests`, { headers });
        setFriendRequests(response.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchFriendRequests();
  }, [headers, BACKEND_URL]);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/users`, { headers });
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, [headers, BACKEND_URL]);

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
      console.error("Error accepting friend request:", error);
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
          onClick={() => setShowFriendRequests((prev) => !prev)}
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

      {/* All Users Section */}
      <div>
        <h3>All Users</h3>
        {allUsers.length > 0 ? (
          <ul>
            {allUsers.map((user) => (
              <li key={user.id}>
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
