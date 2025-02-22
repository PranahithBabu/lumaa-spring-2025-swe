const client = require("./db");

const createTables = async () => {
  try {
    // Check if the 'users' table exists
    const userTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (!userTableCheck.rows[0].exists) {
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      `);
      console.log("'users' table created successfully.");
    } else {
      console.log("'users' table already exists. Skipping creation.");
    }

    // Check if the 'tasks' table exists
    const taskTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tasks'
      );
    `);

    if (!taskTableCheck.rows[0].exists) {
      await client.query(`
        CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          is_complete BOOLEAN DEFAULT FALSE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
        );
      `);
      console.log("'tasks' table created successfully.");
    } else {
      console.log("'tasks' table already exists. Skipping creation.");
    }
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

createTables();
