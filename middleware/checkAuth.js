const db = require("../db");

function checkAuth(req, res, next) {
  const session_id = req.cookies.session_id;

  if (!session_id) {
    req.isAuthenticated = false;
    return next();
  }

  db.get(
    "SELECT * FROM sessions WHERE session_id = ? AND expires_at > datetime('now')",
    [session_id],
    (err, session) => {
      if (err) {
        console.error(err);
        req.isAuthenticated = false;
        return next();
      }
      if (!session) {
        req.isAuthenticated = false;
        return next();
      }

      req.isAuthenticated = true;
      req.user_id = session.user_id;
      next();
    }
  );
}

module.exports = checkAuth;
