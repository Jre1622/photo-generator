require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const checkAuth = require("./middleware/checkAuth");
const Replicate = require("replicate"); // Get THE REPLICATE MODULE

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Require custom Routes
const registerRoute = require("./routes/auth/register");
const loginRoute = require("./routes/auth/login");
const logoutRoute = require("./routes/auth/logout");

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
app.use(checkAuth);
app.use("/", registerRoute); // This will make the route available at /auth/register
app.use("/", loginRoute);
app.use("/", logoutRoute);

// Home page route
app.get("/", (req, res) => {
  res.render("home", { isAuthenticated: req.isAuthenticated });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// New route to check authentication status
app.get("/api/check-auth", checkAuth, (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated });
});

// Replicate Post
app.post("/api/generate-image", checkAuth, async (req, res) => {
  if (!req.isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { prompt } = req.body;

    const input = {
      steps: 3,
      prompt: prompt,
      guidance: 5,
      interval: 2,
      aspect_ratio: "16:9",
      safety_tolerance: 4,
    };

    const output = await replicate.run("black-forest-labs/flux-pro", { input });

    if (typeof output === "string") {
      res.json({ imageUrl: output });
    } else {
      const imageUrl = output[output.length - 1];
      res.json({ imageUrl });
    }
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});
