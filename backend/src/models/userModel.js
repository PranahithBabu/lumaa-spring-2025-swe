const client = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  static async createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`;
    const values = [email, hashedPassword];

    try {
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    try {
      const result = await client.query(query, [email]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;
