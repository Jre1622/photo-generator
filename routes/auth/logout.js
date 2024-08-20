const express = require("express");
const router = express.Router();
const db = require("../../db");

router.post("/auth/logout", (req, res) => {
  const session_id = req.cookies.session_id;

  if (session_id) {
    // Remove the session from the database
    db.run("DELETE FROM sessions WHERE session_id = ?", [session_id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error during logout" });
      }

      // Clear the cookie
      res.clearCookie("session_id");
      res.json({ message: "Logged out successfully" });
    });
  } else {
    res.json({ message: "No active session" });
  }
});

module.exports = router;
