const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();

const app = express();
const authRoutes = require("./routes/authRoutes");


// Middleware
app.use(express.json());
app.use(cors());


// Import Routes
const userRoutes = require("./routes/userRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // Add authentication routes



// MongoDB Connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("Connection error:", error));
