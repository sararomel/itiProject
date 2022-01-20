/*=============call cropsName model ============= */
const Crops = require("../models/Crops");
var redis = require('redis');
var JWT =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwt = new JWT(redisClient);
const {secret}  = require('../secret') ;
/*=============function for get all cropName ============= */
exports.getAllCrops = (req, res) => {
  Crops.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

/*=============function for post cropName ============= */
exports.AddCropName = (req, res) => {
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    let {name, typeId, img, price, stars} = req.body;
    if(decoded.isAdmin){
      let newName = new Crops({
        name, typeId, img, price, stars
      });
      newName
        .save()
        .then((data) => {
          res.status(201).json(data);
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(403).json({ message: "This Crop is already exists" });
          } else if (req.body.typeId < 1 || req.body.typeId > 3) {
            res.status(403).json({ message: "Type Id should between 1 and 3" });
          } else {
            res.status(404).json(err);
          }
        });
    }else{
      res.json({msg : "Only Admin can add Crop"})
    }
  }).catch((err)=>{
    res.status(403).json({msg : "Unauthorized user", err})
  })
};

exports.findCropById = (req, res) => {
  Crops.findOne({ _id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.findCropByName = (req, res) => {
  Crops.findOne({ name: req.params.name })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};


exports.findCropByTypeId = (req, res) => {
  if(req.params.typeId < 1 || req.params.typeId > 3){
    res.status(404).json({msg : "Type ID must be between 1 and 3"})
  }else{
    Crops.find({ typeId: req.params.typeId })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
  }
};

exports.deleteCropById = (req, res) => {
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    if(decoded.isAdmin){
      Crops.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Crop Has been Deleted" });
    })
    .catch(() => {
      res.status(404).json({ message: "Error while Deleting" });
    });
    }else{
      res.status(403).json({msg : "Only Admin can delete Crops"})
    }
  }).catch((err)=>{
    res.json({msg : "Unauthorized user", err});
  })
};

exports.updateCropById = (req, res) => {
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    if(decoded.isAdmin){
      if (req.body.typeId < 1 || req.body.typeId > 3) {
        res.status(403).json({ message: "Type Id should between 1 and 3" });
      } else {
        Crops.findOne({ name: req.body.name }).then((data) => {
          if (data === null) {
            Crops.updateOne(
              { _id: req.params.id },
              { $set: req.body }
            )
              .then(() => {
                res.status(200).json({ message: "Crop Has been Updated" });
              })
              .catch(() => {
                res.status(404).json({ message: "Error while Updating" });
              });
          } else {
            res.status(403).json({ message: "This Name is already exists " });
          }
        }).catch((err)=>{
          res.status(500).json({msg : "Error finding Crop Name", err})
        });
      }
    }else{
      res.status(403).json({msg : "Only Admin can update Crop"})
    }
  }).catch((err)=>{
    res.status(403).json({msg : "Unauthorized User", err})
  })
};




