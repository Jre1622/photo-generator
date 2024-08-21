const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const db = require("../../db");

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Generate session_id
      const session_id = uuidv4();
      const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

      // Store session in database
      db.run(
        "INSERT INTO sessions (user_id, session_id, expires_at) VALUES (?, ?, ?)",
        [user.id, session_id, expires_at.toISOString()],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error creating session" });
          }

          // Set cookie
          res.cookie("session_id", session_id, {
            httpOnly: true,
            secure: false, // This ensures the cookie is only sent over HTTPS | if false will send over HTTP | if true will only send on HTTPS
            expires: expires_at,
          });

          res.status(200).json({ message: "Login successful", userId: user.id });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
