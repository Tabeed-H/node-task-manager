const router = require("express").Router();
const Task = require("../../models/task.MODEL");

// adding a new task
router.post("/task", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all tasks
router.get("/task", async (req, res) => {
  try {
    const data = await Task.find({});
    if (!data) {
      return res.status(404).send("No Task Present");
    }
    res.status(200).send(data);
  } catch (err) {
    res.send(500).send(err);
  }
});

// get task by id
router.get("/task/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(400).send("Not Found");
    }
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update task
router.patch("/task/:id", async (req, res) => {
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
