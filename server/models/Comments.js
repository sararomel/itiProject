const mongoose = require("mongoose");
const Comments = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description:{
    type: String,
    required: true
  },
},{timespamps: true});

module.exports = mongoose.model("Comments", Comments);