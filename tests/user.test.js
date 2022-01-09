const request = require("supertest");
const app = require("../src/main");
const User = require("../src/models/user.MODEL");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const user_1_id = new mongoose.Types.ObjectId();

const user_1 = {
  _id: user_1_id,
  name: "Tabeed",
  email: "tab@gg.com",
  password: "4533!!@9",
  tokens: [
    {
      token: jwt.sign({ _id: user_1_id }, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await User.create(user_1);
});

test("Should Signup", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Tabeed",
      email: "tabeed@gmail.om",
      password: "77788!00",
    })
    .expect(200);

  //Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertion about the response body
  // expect(response.body.user.name).toBe("Tabeed");

  expect(response.body).toMatchObject({
    user: {
      name: "Tabeed",
      email: "tabeed@gmail.om",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("77788!00");
});

test("Should Login User", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: user_1.email,
      password: user_1.password,
    })
    .expect(200);
});

test("Should Reject Login From Non-existant User", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "hame@g.com",
      password: "password",
    })
    .expect(404);
});

test("Should get User Profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer${user_1.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should NOT Access Profile of Unauthorized Users", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should Delete Authorized User", async () => {
  await request(app)
    .delete(`/users/delete`)
    .set("Authorization", `Bearer${user_1.tokens[0].token}`)
    .send()
    .expect(200);
});
