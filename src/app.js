const express = require("express");
const User = require("./models/user.MODEL");
const Task = require("./models/task.MODEL");

// Connect to database
require("./db/mongoose");

// express setup
const app = express();

// express middlewares
app.use(express.json()); // to parse with JSON data

// setup Port
const PORT = process.env.PORT || 3000;
const userRoutes = require("./routes/user/user.ROUTES");
const taskRoutes = require("./routes/task/task.ROUTES");

// routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

const multer = require("multer");
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/))
      return cb(new Error("Not a valid Doc file"));
    cb(undifined, tru);
  },
});

app.post("/upload", upload.single("upload"), async (req, res) => {
  res.send();
});

app.use(userRoutes);
app.use(taskRoutes);

// Starting up server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Server running on PORT ${PORT}`);
});
