const mongoose = require("mongoose");
const article = require("./article");
const articleSchema = mongoose.Schema({
  _id:{
    type:Number
  },
  description: {
    type: String,
    default: "",
  },
  images: {
    type: Array,
    default: [],
  },
  title: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  likes: {
    type: String,
    default: "",
  },
  comments: {
    type: String,
    default: "",
  },
  date:{
      type:Date,
      default:"20/10/2021"
  }
});
module.exports = mongoose.model("article", articleSchema);
