const { Schema, model } = require("mongoose");

const postsSchema = new Schema({
  title: {
    type: String,
    required: [true, "DB validation: title is required"],
  },
  author: {
    type: String,
    required: [true, "DB validation: author is required"],
  },

  language: {
    type: String,
    default: "en",
  },
  rating: {
    type: Number,
    default: 0.0,
  },
});

module.exports = model("posts", postsSchema);
