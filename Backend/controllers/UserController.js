import db from "../config/db.js";
import bcrypt from "bcryptjs";

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT id, name, email, role, job_position, birthday, date_hired FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    let params = [];
    
    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ? OR job_position LIKE ?';
      countQuery += ' WHERE name LIKE ? OR email LIKE ? OR job_position LIKE ?';
      const searchParam = `%${search}%`;
      params = [searchParam, searchParam, searchParam];
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [users] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, search ? [params[0], params[1], params[2]] : []);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, job_position, birthday, date_hired FROM users WHERE id = ?",
      [req.params.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new user
const createUser = async (req, res) => {
  const { name, email, password, role = 'employee', job_position, birthday, date_hired } = req.body;

  try {
    // check if user already exists
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (row.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // insert user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role, job_position, birthday, date_hired) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role, job_position, birthday, date_hired]
    );

    res.status(201).json({ 
      message: "User created successfully", 
      userId: result.insertId 
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error during user creation" });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { name, email, job_position, birthday, date_hired } = req.body;
  const userId = req.params.id;

  // Format dates for MySQL (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formattedBirthday = formatDate(birthday);
  const formattedDateHired = formatDate(date_hired);

  try {
    // Check if user can update this profile (admin or own profile)
    if (req.user.role !== 'admin' && req.user.id != userId) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Check if user exists
    const [existingUser] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is taken by another user
    if (email) {
      const [emailCheck] = await db.query(
        "SELECT id FROM users WHERE email = ? AND id != ?", 
        [email, userId]
      );
      if (emailCheck.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    const role = req.body.role || 'employee';

    // Update user
    await db.query(
      "UPDATE users SET name = ?, email = ?, role = ?, job_position = ?, birthday = ?, date_hired = ? WHERE id = ?",
      [name, email, role, job_position, formattedBirthday, formattedDateHired, userId]
    );

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error during user update" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if user exists
    const [existingUser] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await db.query("DELETE FROM users WHERE id = ?", [userId]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error during user deletion" });
  }
};

// Update user password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    // Check if user can update this password (admin or own password)
    if (req.user.role !== 'admin' && req.user.id != userId) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Get user with password
    const [users] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: "Server error during password update" });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, job_position, birthday, date_hired FROM users WHERE id = ?",
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  updatePassword,
  getCurrentUser 
};