const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/taskModel");

const router = express.Router();

// Create a Task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, is_complete } = req.body;
  const userId = req.user.userId;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  try {
    const newTask = await Task.createTask(userId, title, description, is_complete===undefined ? false : is_complete);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
});

// Get All Tasks for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.getTasksByUser(req.user.userId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

// Get a Single Task by ID
router.get("/:taskId", authMiddleware, async (req, res) => {
  try {
    const task = await Task.getTaskById(req.user.userId, req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error fetching task", error: err.message });
  }
});

// Update a Task
router.put("/:taskId", authMiddleware, async (req, res) => {
  const { title, description, is_complete } = req.body;

  try {
    const updatedTask = await Task.updateTask(req.user.userId, req.params.taskId, title, description, is_complete===undefined ? false : is_complete);
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
});

// Delete a Task
router.delete("/:taskId", authMiddleware, async (req, res) => {
  try {
    const task = await Task.getTaskById(req.user.userId, req.params.taskId);
    if(!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }
    const message = await Task.deleteTask(req.user.userId, req.params.taskId);
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
});

module.exports = router;
