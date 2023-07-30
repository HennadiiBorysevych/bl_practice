const { Schema, model } = require("mongoose");

const usersSchema = new Schema({
  email: {
    type: String,
    required: [true, "DB validation: email is required"],
  },
  password: {
    type: String,
    required: [true, "DB validation: password is required"],
  },
  name: {
    type: String,
    default: "Sandra Bullock",
  },
  token: {
    type: String,
    default: null,
  },
  roles: [
    {
      type: String,
      ref: "roles",
    },
  ],
});

module.exports = model("users", usersSchema);
