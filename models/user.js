const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432, // Default PostgreSQL port
});

// Define the User model
class User {
  // Method to create a new user
  static async createUser(username, email, password) {
    try {
      const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
      const values = [username, email, password];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Method to find a user by username
  static async findByUsername(username) {
    try {
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [username];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  // Add more methods as needed, such as updating user information, deleting a user, etc.
}

module.exports = User;
