require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

// Require custom Routes
const registerRoute = require("./routes/auth/register");
const loginRoute = require("./routes/auth/login");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", registerRoute); // This will make the route available at /auth/register
app.use("/", loginRoute);

// Home page route
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
