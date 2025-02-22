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
const db_1 = __importDefault(require("../config/db"));
const Task = {
    createTask(userId, title, description, is_complete) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('INSERT INTO tasks (user_id, title, description, is_complete) VALUES ($1, $2, $3, $4) RETURNING *', [userId, title, description, is_complete]);
            return result.rows[0];
        });
    },
    getTasksByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
            return result.rows;
        });
    },
    getTaskById(userId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
            return result.rows[0];
        });
    },
    updateTask(userId, taskId, title, description, is_complete) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('UPDATE tasks SET title = $1, description = $2, is_complete = $3 WHERE id = $4 AND user_id = $5 RETURNING *', [title, description, is_complete, taskId, userId]);
            return result.rows[0];
        });
    },
    deleteTask(userId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.default.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
            return { message: 'Task deleted successfully' };
        });
    },
};
exports.default = Task;
