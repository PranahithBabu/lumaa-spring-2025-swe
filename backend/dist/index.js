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
require("./config/initDB"); // Import initialization script
require("dotenv/config"); // Load environment variables
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db")); // Import database client
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Import auth routes
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes")); // Import task routes
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/tasks', taskRoutes_1.default);
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.connect(); // Connect to the database
        console.log(`Server running on port ${PORT}`);
    }
    catch (err) {
        console.error('Error connecting to database', err);
    }
}));
