const router = require("express").Router();
const Task = require("../../models/task.MODEL");
const auth = require("../../middleware/auth");

// adding a new task
router.post("/task", auth, async (req, res) => {
  try {
    // const task = new Task(req.body);
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all tasks
router.get("/tasks", auth, async (req, res) => {
  try {
    const match = {};
    if (req.query.completed) {
      match.completed = Boolean(req.query.completed === "true");
    }
    await req.user.populate({
      path: "task",
      match,
      options: {
        limit: Number(req.query.limit),
        skip: Number(req.query.skip),
        sort: {
          createdAt: 1,
        },
      },
    });
    res.send(req.user.task);
    // res.send(req.user.tasks);
  } catch (err) {
    res.status(400).send({ Error: err });
  }
});

// update task
router.patch("/task/:id", auth, async (req, res) => {
  const update = Object.keys(req.body);
  const allowedUpdate = ["description", "completed"];
  const allowed = update.every((update) => allowedUpdate.includes(update));
  if (!allowed) return res.status(400).send("Not ALlowed");

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const task = await Task.findById(req.params.id);
    update.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    if (!task) return res.status(404).send("Task not found");

    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

// delete task
router.delete("/task/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send("Not found");
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
