require('./config/initDB.js');
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const client = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await client.connect();
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error("Error connecting to database", err);
  }
});
