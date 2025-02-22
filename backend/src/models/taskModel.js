const client = require("../config/db");

const Task = {
  async createTask(userId, title, description, is_complete) {
    const result = await client.query(
      "INSERT INTO tasks (user_id, title, description, is_complete) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, title, description, is_complete]
    );
    return result.rows[0];
  },

  async getTasksByUser(userId) {
    const result = await client.query("SELECT * FROM tasks WHERE user_id = $1", [userId]);
    return result.rows;
  },

  async getTaskById(userId, taskId) {
    const result = await client.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [taskId, userId]);
    return result.rows[0];
  },

  async updateTask(userId, taskId, title, description, is_complete) {
    const result = await client.query( 
      "UPDATE tasks SET title = $1, description = $2, is_complete = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [title, description, is_complete, taskId, userId]
    );
    return result.rows[0];
  },

  async deleteTask(userId, taskId) {
    await client.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [taskId, userId]);
    return { message: "Task deleted successfully" };
  }
};

module.exports = Task;
