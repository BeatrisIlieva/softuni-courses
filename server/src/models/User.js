const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { DEFAULT_SALT } = require("../constants/password");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required."],
    minLength: [5, "Email is too short"],
    match: [/^[A-za-z0-9]+@+[a-z]+\.[a-z]+$/, "Invalid email format."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    validate: {
      validator: function (value) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(value);
      },
      message: `Password must contain at least one letter and one digit.`,
    },
    minLength: [8, "Password is too short!"],
  },
  sessionKey: String,
});

userSchema.virtual("repeatPassword").set(function (value) {
  if (value !== this.password) {
    throw new Error("The two password fields didn't match.");
  }
});

userSchema.pre("save", async function () {
  const hash = await bcrypt.hash(this.password, DEFAULT_SALT);

  this.password = hash;
});

const User = mongoose.model("User", userSchema);

module.exports = User;



// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     }
// });

// userSchema.pre("save", async function() {
//     const hash = await bcrypt.hash(this.password, 10);

//     this.password = hash;
// })

// const User = mongoose.model("User", userSchema);

// module.exports = User;