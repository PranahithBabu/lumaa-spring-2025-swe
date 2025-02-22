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
const db_1 = __importDefault(require("./db"));
const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the 'users' table exists
        const userTableCheck = yield db_1.default.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
        if (!userTableCheck.rows[0].exists) {
            yield db_1.default.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      `);
            console.log("'users' table created successfully.");
        }
        else {
            console.log("'users' table already exists. Skipping creation.");
        }
        // Check if the 'tasks' table exists
        const taskTableCheck = yield db_1.default.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tasks'
      );
    `);
        if (!taskTableCheck.rows[0].exists) {
            yield db_1.default.query(`
        CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          is_complete BOOLEAN DEFAULT FALSE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
        );
      `);
            console.log("'tasks' table created successfully.");
        }
        else {
            console.log("'tasks' table already exists. Skipping creation.");
        }
    }
    catch (err) {
        console.error('Error creating tables:', err);
    }
});
createTables();
