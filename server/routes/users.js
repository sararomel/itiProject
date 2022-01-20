var express = require("express");
const { check, validationResult } = require("express-validator");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User");
var redis = require('redis');
var JWT =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwt = new JWT(redisClient);
const {secret}  = require('../secret') ;
let hashedPassword;

/* GET All Users. */
router.get("/", async (req, res) => {
  await User.find({}, {password : 0})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ err });
    });
});

/*Posting New User */
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check(
      "password",
      `password must be at least one upperCase, one lowerCase, one Digit, one special character, minimum length is 8`
    ).matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[# ?!@$%^&*-]).{8,}$/
    ),
    check("email", "Email is not valid").isEmail(),
    check("mobile", "mobile is not valid").matches(
      /^(010|011|012|015)[0-9]{8}/
    ),
  ],
  checkEmail,
  checkMobile,
  hashPassword,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        mobile: req.body.mobile,
        location: req.body.location ? req.body.location : "",
        image: req.body.image ? req.body.image : "",
        isAdmin : req.body.isAdmin
      });
      await newUser
        .save()
        .then((data) => {
          console.log('data')
          let {_id, name, email, mobile, isAdmin, location, image, favourites} = data;
          jwt.sign({_id, name, email, mobile, isAdmin, location, image, favourites}, secret, {
            expiresIn: "1h", // able to change
          }).then((token)=>{
              res.json({ msg: "New User have been Created", token });
          }).catch((err)=>{
            res.json({msg: err})
          });
        })
        .catch((err) => {
          res.status(404).json({ err });
        });
    }
  }
);

// check if email exists
async function checkEmail(req, res, next) {
  await User.find({ email: req.body.email })
    .then((data) => {
      if (data.length > 0) {
        res.status(403).json({ error: "This Email is already exists" });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(404).json({ err });
    });
}

// check if mobile exists
async function checkMobile(req, res, next) {
  await User.find({ mobile: req.body.mobile })
    .then((data) => {
      if (data.length > 0) {
        res.status(403).json({ error: "This Mobile is already exists" });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.json({ err });
    });
}

//hashing password
async function hashPassword(req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      res.status(404).json({ err });
    } else {
      hashedPassword = hash;
      next();
    }
  });
}

// login using jwt with mobile number and password ..
router.post("/login", async (req, res) => {
  await User.findOne({ mobile: req.body.mobile })
    .then((data) => {
      if (data === null) {
        res.status(404).json({ message: "this mobile is not exist" });
      } else {
        bcrypt
          .compare(req.body.password, data.password)
          .then((response) => {
            if (response) {
              // dont forget to remove password 
              let {_id, name, email, mobile, isAdmin, location, image, favourites} = data;
              jwt.sign({_id, name, email, mobile, isAdmin, location, image, favourites}, secret, {
                expiresIn: "1h",
              }).then((token)=>{
                res.json({ msg: "Successfully Logged in", token });
              }).catch(()=>{
                res.json({msg : "Error generating token"})
              });
            } else res.json({ message: "Password is incorrect" });
          })
          .catch((err) => {
            res.status(404).json({ err });
          });
      }
    })
    .catch((err) => {
      res.status(404).json({ err });
    });
});

//Find By Mobile
router.get("/getMobile", async (req, res) => {
  await User.findOne({ mobile: req.body.mobile })
    .then((data) => {
      if (data === null) {
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.json({ err });
    });
});

// logout from website ..
router.post("/logout", (req, res) => {
  jwt.destroy(req.header('Authorization')).then((data)=>{
    res.status(200).json({ message: "successfully signed out" });
  }).catch((err)=>{
    res.json({msg : "You have no token"})
  })
});

// Find User By Id ..
router.get("/:id", async (req, res) => {
  await User.findOne({ _id: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Delete User By Id
router.delete("/deleteUser/:id", async (req, res) => {
  let token = req.header("Authorization");
  if (token) {
    await jwt.verify(token, secret).then( async ()=>{
      await User.deleteOne({_id : req.params.id}).then(()=>{
        res.status(200).json({msg  : "User have been deleted"})
      }).catch((err)=>{
        res.status(404).json({msg : "Error deleting User"})
      })
    }).catch((err)=>{
      res.json({msg : "Error line 184"})
    });
  } else {
    res.json({ msg: "Unauthorized User" });
  }
});

// update User By IDs
router.put("/updateUser/:id", async (req, res) => {
  let token = req.header("Authorization");
  if (token) {
    jwt.verify(token, secret).then(async (result)=>{
      console.log(result)
      if (result.isAdmin || result._id === req.params.id) {
        await User.updateOne({ _id: req.params.id }, { $set: req.body })
          .then((data) => {
            res.status(200).json({ message: "updated Successfully", data });
          })
          .catch((err) => {
            res.status(404).json(err);
          });
      } else {
        res.json({ msg: "You are not allowed to update this user" });
      }
    }).catch((err)=>{
      res.json({ msg: "InValid Token" });
    });
  } else {
    res.json({ msg: "Unauthorized User" });
  }
});



module.exports = router;
