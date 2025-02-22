"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
const router = express_1.default.Router();
// Create a Task
router.post('/', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, is_complete } = req.body;
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = parseInt(req.user.userId, 10); // Now matches the type declaration
    const completeStatus = is_complete !== null && is_complete !== void 0 ? is_complete : false;
    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }
    try {
        const newTask = yield taskModel_1.default.createTask(userId, title, description, completeStatus);
        res.status(201).json(newTask);
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
}));
// Get All Tasks for Logged-in User
router.get('/', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const tasks = yield taskModel_1.default.getTasksByUser(parseInt(req.user.userId, 10));
        res.json(tasks);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
}));
// Get a Single Task by ID
router.get('/:taskId', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const taskId = parseInt(req.params.taskId, 10);
    if (isNaN(taskId)) {
        return res.status(400).json({ message: 'Invalid task ID' });
    }
    try {
        const task = yield taskModel_1.default.getTaskById(parseInt(req.user.userId, 10), taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching task', error: err.message });
    }
}));
// Update a Task
router.put('/:taskId', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { title, description, is_complete } = req.body;
    const taskId = parseInt(req.params.taskId, 10);
    const completeStatus = is_complete !== null && is_complete !== void 0 ? is_complete : false;
    if (isNaN(taskId)) {
        return res.status(400).json({ message: 'Invalid task ID' });
    }
    try {
        const updatedTask = yield taskModel_1.default.updateTask(parseInt(req.user.userId, 10), taskId, title, description, completeStatus);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }
        res.json(updatedTask);
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
}));
// Delete a Task
router.delete('/:taskId', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const taskId = parseInt(req.params.taskId, 10);
    if (isNaN(taskId)) {
        return res.status(400).json({ message: 'Invalid task ID' });
    }
    try {
        const userId = parseInt(req.user.userId, 10);
        const task = yield taskModel_1.default.getTaskById(userId, taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }
        const message = yield taskModel_1.default.deleteTask(userId, taskId);
        res.json(message);
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
}));
exports.default = router;
