const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Not A Valid Email ID!");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate(val) {
      if (val.toLowerCase().includes("password")) {
        throw new Error("Don't Use Common Passwords!");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(val) {
      if (val < 0) {
        throw new Error("Please Enter A Valid Age!");
      }
    },
  },
});

userSchema.pre("save", async function (next) {
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
