var express = require('express');
var router = express.Router();
var redis = require('redis');
var JWT =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwt = new JWT(redisClient);
const {secret}  = require('../secret') ;
var Subscribers = require('../models/subscribers');

router.post('/', (req, res) => {
  Subscribers.find({email: req.body.email}).then((data)=>{
    if(data === null){
      const new__subscriber = new Subscribers({
        email : req.body.email
      });
      new__subscriber.save().then(data =>{
        res.status(201).json({data})
      })
      .catch((err)=>{
        res.status(500).json({msg : "Error while saving new document into DB", err})
      })
    }else{
      res.status(409).json({msg : "This subscriber is already exist"})
    }
  }).catch((err)=>{
    res.status(500).json({msg : "Error while Checking if subscriber exist", err})
  })
});

router.get('/',(req, res)=>{
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    if(decoded.isAdmin){
      Subscribers.find({}).then((data)=>{
        res.status(200).json({data})
      }).catch((err)=>{
        res.status(500).json({msg : "Error from server", err})
      })
    }else{  
      res.status(403).json({msg : "Only Admin can view Subscribers"})
    }
  }).catch((err)=>{
    res.status(403).json({msg : "Unauthorized user", err})
  })
})

router.get('/:id',(req, res)=>{
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    if(decoded.isAdmin){
      Subscribers.findOne({_id: req.params.id}).then((data)=>{
        res.status(200).json({data})
      }).catch((err) => {
        res.status(500).json({msg : "Error from server", err})
      })
    }else{
      res.status(403).json({msg : "Only Admin can view this subscriber"})
    }
  }).catch((err)=>{
    res.status(403).json({msg : "Unauthorized user", err})
  })
})

router.delete('/:id',(req, res)=>{
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    if(decoded.isAdmin){
      Subscribers.deleteOne({_id: req.params.id}).then((data)=>{
        res.status(200).json({data})
      }).catch((err)=>{
        res.status(500).json({msg : "Error from server", err})
      })
    }else{  
      res.status(403).json({msg : "Only Admin can delete subscribers"})
    }
  }).catch((err)=>{
    res.status(403).json({msg : "Unauthorized user", err})
  })
})

module.exports = router;
