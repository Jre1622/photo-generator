const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../../db");

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if user exists
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Compare password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Login successful
      // Here you would typically create a session or JWT token
      res.status(200).json({ message: "Login successful", userId: user.id });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
