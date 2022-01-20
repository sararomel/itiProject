var express = require('express');
var router = express.Router();
const AgricultureCrops = require("../models/AgricultureCrops");
const Crops = require("../models/Crops");
const User = require("../models/User");
const { secret } = require("../secret");
var redis = require("redis");
var JWT = require("jwt-redis").default;
var redisClient = redis.createClient();
var jwt = new JWT(redisClient);
var multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, './productImage/')
  },
  filename: function(req, file, callback){
    callback(null, new Date().toDateString()+ file.originalname)
  }
})

const upload = multer({storage})

router.get('/', (req, res) => { // works fine 
  AgricultureCrops.find({}).populate('Owner name')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      req.json({
        message: "Error Finding AgricultureCrops",
        error,
      });
    });
});

router.post('/',upload.single('images'),(req, res) => { // works fine 
  Crops.findOne({
    _id: req.body.name,
  })
    .then((data) => {
      if (data === null) {
        res.json({
          msg: "you must enter a correct crop ID",
        });
      } else {
        checkForPriceAndQuantity(req, res);
      }
    })
    .catch(() => {
      res.status(404).json({
        message: "Error Finding Crop",
      });
    });
});

const checkForPriceAndQuantity = (req, res) => {
  if (req.body.price < 0 || req.body.quantity <= 0) {
    res.status(404).json({
      message: "Price and quantity must be greater than 0 ",
    });
  } else {
    checkForQuantityID(req, res);
  }
};

const checkForQuantityID = (req, res) => {
  if (req.body.quantityId < 1 || req.body.quantityId > 6) {
    res.status(403).json({
      message: "Quantity Id must between 1 and 6 ",
    });
  } else {
    AddAgricultureCrop(req, res);
  }
};

const AddAgricultureCrop = (req, res) => {
  jwt
    .verify(req.header("Authorization"), secret)
    .then((result) => {
      let {
        name,
        description,
        locationLongitude,
        locationLatitude,
        price,
        quantity,
        quantityId,
      } = req.body;
      let newAgricultureCrop = new AgricultureCrops({
        name,
        description,
        images: req.file.path,
        locationLongitude,
        locationLatitude,
        price,
        quantity,
        quantityId,
        Owner: result._id
      });
      newAgricultureCrop
        .save()
        .then((data) => {
          AddNewAgricultureCropToUserTable(res, result, data);
        })
        .catch((err) => {
          res.status(403).json({
            message: "Error Creating new Agriculture",
            err,
          });
        });
    })
    .catch(() => {
      res.status(403).json({
        msg: "You are not authorized",
      });
    });
};

const AddNewAgricultureCropToUserTable = (res, decoded, data) => {
  User.updateOne(
    {
      _id: decoded._id,
    },
    {
      $push: {
        AgricultureCrop: data._id,
      },
    }
  )
    .then(() => {
      res.status(201).json({
        message: "New Agriculture Crop has been created",
      });
    })
    .catch((err1) => {
      res.json({
        msg: "Error Adding new Crop  ",
        err1,
      });
    });
};

router.get('/:id',(req, res) => { // works fine 
  AgricultureCrops.findOne({
    _id: req.params.id,
  }).populate('Owner name')
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      req.json({
        error,
      });
    });
});

router.delete('/:id',(req, res) => { // works fine 
  jwt
    .verify(req.header("Authorization"), secret)
    .then((decoded) => {
      if (decoded.isAdmin) {
        // ask on it
        deleteAgricultureCropFromUserTable(req, res);
      } else {
        checkIfThisUserIsTheOwnerOfThisAgricultureCrop(req, res, decoded, true);
      }
    })
    .catch((err) => {
      res.json({
        mag: "Unauthorized User",
        err,
      });
    });
});

const deleteAgricultureCropFromUserTable = (req, res) => {
  User.updateOne(
    {
      AgricultureCrop: req.params.id,
    },
    {
      $pull: {
        AgricultureCrop: {
          $in: [req.params.id],
        },
      },
    }
  )
    .then(() => {
      AgricultureCrops.deleteOne({
        _id: req.params.id,
      })
        .then(() => {
          res.json({
            msg: "Agriculture Crop has been deleted from this table and user table",
          });
        })
        .catch(() => {
          res.json({
            msg: "Error deleting agriculture Crop",
          });
        });
    })
    .catch((err) => {
      res.json({
        msg: "Error deleting Agriculture Crop in user table ",
        err,
      });
    });
};

router.patch('/:id',(req, res) => { // works fine 
  jwt
    .verify(req.header("Authorization"), secret)
    .then((decoded) => {
      if (decoded.isAdmin) {
        updateAgricultureCrop(req, res);
      } else {
        checkIfThisUserIsTheOwnerOfThisAgricultureCrop(
          req,
          res,
          decoded,
          false
        );
      }
    })
    .catch(() => {
      res.status(403).json({
        msg: "Unauthorized User",
      });
    });
});

const updateAgricultureCrop = (req, res) => {
  AgricultureCrops.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: req.body,
    }
  )
    .then(() => {
      res.json({
        msg: "Agriculture Crop have been updated",
      });
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
};

const checkIfThisUserIsTheOwnerOfThisAgricultureCrop = (
  req,
  res,
  decoded,
  isExecutedAfterDelete
) => {
  User.findOne({
    AgricultureCrop: req.params.id,
  })
    .then((data) => {
      if (decoded._id === data._id.toString()) {
        if (isExecutedAfterDelete) {
          deleteAgricultureCrop(req, res);
        } else {
          updateAgricultureCrop(req, res);
        }
      } else {
        res.status(403).json({
          msg: "You are not the owner of this agriculture Crop",
        });
      }
    })
    .catch((err) => {
      res.stats(500).json({
        msg: "Error Finding User",
        err,
      });
    });
};

const deleteAgricultureCrop = (req, res) => {
  AgricultureCrops.deleteOne({
    _id: req.params.id,
  })
    .then(() => {
      deleteAgricultureCropFromUserTable(req, res);
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Error deleting Agriculture Crop",
        err,
      });
    });
};

module.exports = router;
