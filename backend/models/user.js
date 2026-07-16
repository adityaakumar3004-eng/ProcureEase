const db = require("../config/db");

// Create a new user
const createUser = async (fullName, email, hashedPassword, role) => {
  const query = `
    INSERT INTO users (full_name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    fullName,
    email,
    hashedPassword,
    role,
  ]);

  return result;
};

// Find user by email
const findUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users
    WHERE email = ?
  `;

  const [rows] = await db.execute(query, [email]);

  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};