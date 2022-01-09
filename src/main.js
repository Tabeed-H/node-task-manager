const express = require("express");
const User = require("./models/user.MODEL");
const Task = require("./models/task.MODEL");

// Connect to database
require("./db/mongoose");

// express setup
const app = express();

// express middlewares
app.use(express.json()); // to parse with JSON data

const userRoutes = require("./routes/user/user.ROUTES");
const taskRoutes = require("./routes/task/task.ROUTES");

// routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use(userRoutes);
app.use(taskRoutes);

module.exports = app;
