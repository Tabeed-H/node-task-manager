const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
});

// const Task = mongoose.model("Task", {
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
// });
