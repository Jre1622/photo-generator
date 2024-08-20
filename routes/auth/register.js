const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../../db");

router.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  // Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Check if email is already taken
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      if (user) {
        return res.status(400).json({ error: "Email already in use" });
      }

      try {
        // Hash and salt the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user in the database
        db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error creating user" });
          }
          res.status(201).json({ message: "User created successfully", userId: this.lastID });
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during password hashing" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
