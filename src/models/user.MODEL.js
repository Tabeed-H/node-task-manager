const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require('./task.MODEL')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "thisisasecret");

  // add token to user
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to Login NO user found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Wrong Email or password");

  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.pre("remove", async function(next){
  await Task.deleteMany({ower = this._id});
  next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;
