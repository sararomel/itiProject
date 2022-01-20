const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { secret } = require("../secret");
var redis = require("redis");
var JWT = require("jwt-redis").default;
const AgricultureLand = require("../models/AgricultureLand");
var redisClient = redis.createClient();
var jwt = new JWT(redisClient);

router.post("/", async (req, res) => {
  jwt
    .verify(req.header("Authorization"), secret)
    .then((decoded) => {
      if (req.body.type < 1 || req.body.type > 6) {
        res.status(404).json({ msg: "Type must be between 1 and 6" });
      } else if (req.body.price < 0) {
        res.status(404).json({ msg: "Price must be grater than 0" });
      } else if (req.body.measurement < 1 || req.body.measurement > 3) {
        res.status(404).json({ msg: "Measurement must be between 1 and 3" });
      } else {
        addNewAgricultureLand(req, res, decoded);
      }
    })
    .catch((err) => {
      res.status(403).json({ msg: "Unauthorized User", err });
    });
});


const addNewAgricultureLand = (req, res, decoded) => {
  let {
    description,
    area,
    image,
    longitude,
    latitude,
    type,
    price,
    measurement,
  } = req.body;
  const newLand = new AgricultureLand({
    description,
    area,
    image,
    longitude,
    latitude,
    type,
    price,
    measurement,
  });
  newLand
    .save()
    .then((data) => {
      addAgricultureLandToUserTable(res, data, decoded);
    })
    .catch((err) => {
      res.status(500).json({ msg: "Error Adding New Agriculture Land", err });
    });
};

const addAgricultureLandToUserTable = (res, data, decoded) => {
  User.updateOne({ _id: decoded._id }, { $push: { AgricultureLand: data._id } })
    .then(() => {
      res
        .status(201)
        .json({ msg: "Agriculture Land have been added successfully" });
    })
    .catch((err) => {
      res.json({
        msg: "Error finding User to add Agriculture land on his table",
        err,
      });
    });
};


router.get("/", async (req, res) => {
  try {
    const land = await AgricultureLand.find({});
    res.status(200).json(land);
  } catch (error) {
    res.status(500).json({msg : "Server Error"});
  }
});


router.get("/:id", async (req, res) => {
  try {
    const land = await AgricultureLand.findOne({ _id: req.params.id });
    if (!land) {
      res.status(404).json({ msg: "This Land not Found" });
    }
    res.status(200).json(land);
  } catch (error) {
    res.status(500).json({msg : "Server Error"});
  }
});


router.delete("/:id", async (req, res) => {
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    if(decoded.isAdmin){
      deleteAgricultureLandFromUserTable(req, res);
    }else{
      checkIfUserIsTheOwnerOfAgricultureLand(req, res, decoded, true)
    }
  }).catch((err)=>{
    res.json({msg : "Unauthorized user", err})
  })
});

const deleteAgricultureLandFromUserTable = (req, res) => { 
  User.updateOne({AgricultureLand : req.params.id},{$pull : {AgricultureLand : {$in :[req.params.id]}}}).then(()=>{
    deleteAgricultureLandFromAgricultureLandTable(req, res);
  }).catch((err)=>{
    res.status(500).json({msg : "Error deleting Agriculture Land From User Table", err})
  })
};

const deleteAgricultureLandFromAgricultureLandTable = (req, res) => { 
  AgricultureLand.deleteOne({_id: req.params.id}).then(()=>{
    res.status(200).json({msg : "Agriculture Land has been deleted from Agriculture table and from User table"});  
  }).catch((err)=>{
    res.status(500).json({msg : "Error Deleting Agriculture land from server", err})
  })
};

router.put("/:id", async (req, res) => {
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    if(decoded.isAdmin){
      updateAgricultureLand(req, res);
    }else{
      checkIfUserIsTheOwnerOfAgricultureLand(req, res, decoded, false);
    }
  }).catch((err)=>{
    res.status(403).json({msg : "Unauthorized User", err})
  })
});

const checkIfUserIsTheOwnerOfAgricultureLand = (req, res, decoded, isExecutedAfterDelete) => { 
  User.findOne({AgricultureLand : req.params.id},{password : 0}).then((data)=>{
    if(data._id.toString() === decoded._id){
      if(isExecutedAfterDelete){
        deleteAgricultureLandFromUserTable(req, res)
      }else{
        updateAgricultureLand(req, res);
      }
    }else{
      res.status(403).json({msg : "You are not allowed"})
    }
  }).catch((err)=>{
    res.status(500).json({msg : "Error finding user from server .. ", err})
  })
};

const updateAgricultureLand = (req, res) => { 
  AgricultureLand.updateOne({_id: req.params.id},{$set : req.body}).then(()=>{
    res.status(200).json({msg : "Agriculture Land has been updated successfully"})
  }).catch((err)=>{
    res.status(500).json({msg : "Error updating Agriculture Land from server .. "})
  })
};

module.exports = router;
