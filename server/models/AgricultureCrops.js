const mongoose = require("mongoose");
const AgricultureCropsSchema = mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crops",
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  images: {
    type: String,
    default: "",
  },
  locationLongitude: {
    type: Number,
    required: true,
  },
  locationLatitude: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
  },
  quantityId: {
    type: Number,
    min: 1,
    max: 6,
  },
  comments : {
    type : [mongoose.Schema.Types.ObjectId],
    ref : 'Comments'
  },
  Owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User"
  }
   // 1 - طن
  // 2- كيلوجرام
  // 3- إردب
  // 4 - شوال
  // 5- قطعه
  // 6- قفص
}, {timestamps: true});

module.exports = mongoose.model("AgricultureCrops", AgricultureCropsSchema);
