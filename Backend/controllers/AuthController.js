import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // search for user
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = row[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check if password is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if user already exists
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (row.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const role = 'employee';

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // insert user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    // create JWT token
    const token = jwt.sign(
      { id: result.insertId, role: role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: result.insertId, email: email, role: role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export { login, register };
