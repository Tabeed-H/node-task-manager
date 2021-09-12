const router = require("express").Router();
const User = require("../../models/user.MODEL");
// require("../../db/mongoose");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// showing a list of users
router.get("/users", async (req, res) => {
  try {
    const data = await User.find({});

    if (!data) {
      res.send([]);
      return;
    }

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

// getting a particular user
router.get("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
      return res.send(404).send("No User found");
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update user
router.patch("/users/:id", async (req, res) => {
  const update = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];

  const isAllowed = update.every((update) => allowedUpdates.includes(update));
  if (!isAllowed) return res.status(400).send("Not allowed");
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(400).send("Not found");

    res.send(user);
  } catch (err) {
    res.st(500).send(err);
  }
});

// delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send("User NOt FOund");
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
