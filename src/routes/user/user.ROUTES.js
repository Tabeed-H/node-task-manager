const router = require("express").Router();
const User = require("../../models/user.MODEL");
const auth = require("../../middleware/auth");
// require("../../db/mongoose");

// add user
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateToken();
    res.status(200).send({ user: user, token: token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// showing a list of users
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// update user
router.patch("/users/:id", auth, async (req, res) => {
  const update = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];

  const isAllowed = update.every((update) => allowedUpdates.includes(update));
  if (!isAllowed) return res.status(400).send("Not allowed");
  try {
    update.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!req.user) return res.status(400).send("Not found");

    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// user login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();

    res.send({ user: user, token: token });
  } catch (err) {
    console.log(err);
  }
});

// logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token != req.token
    );
    await req.user.save();

    res.status(200).send("Logout success!!");
  } catch (err) {
    res.send(err);
  }
});

// logout every user
router.post("/users/logout/all", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Logged out of every device!");
  } catch (err) {
    res.send(err);
  }
});

// delete user
router.delete("/users/:id", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
