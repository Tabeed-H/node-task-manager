require("../src/db/mongoose");

const User = require("../src/models/user.MODEL");

// User.findByIdAndUpdate("6138fcfb2a418d148bcfa2d4", { age: 1 })
//   .then((data) => {
//     console.log(data);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((e) => console.log(e));

// const Task = require("../src/models/task.MODEL");

// Task.findByIdAndDelete("613cb947b478ef957b8d9d22")
//   .then((data) => {
//     console.log(data);
//     return Task.count({ completed: false });
//   })
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

const updateAgeAndCount = async function (_id, _age) {
  const updated = await User.findByIdAndUpdate(_id, { age: _age });
  const count = await User.count({ age: 20 });

  return {
    updates: updated,
    count: count,
  };
};

updateAgeAndCount("613a3db7723bb4f37e27532d", 20)
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
