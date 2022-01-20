var express = require('express');
var router = express.Router();
var Contact = require('../models/Contact');
var redis = require('redis');
var JWT =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwt = new JWT(redisClient);
const {secret}  = require('../secret') ;

router.post('/', (req, res)=>{
  let {fullName, email, mobile, message} = req.body;
  let new__contact = new Contact({fullName, email, mobile, message});
  new__contact.save()
      .then((data)=>{
        res.status(200).json({data, msg : "You successfully contacted with us "})
      }).catch((err)=>{
        res.status(500).json({msg : "Error from server ..", err})
      });
});

router.get('/',(req, res)=>{
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    if(decoded.isAdmin){
      Contact.find({}).then((data)=>{
        res.status(200).json({data})
      }).catch((err)=>{
        res.status(500).json({msg : "Error from server", err})
      })
    }else{  
      res.status(403).json({msg : "Only Admin can view contacts"})
    }
  }).catch((err)=>{
    res.status(403).json({msg : "Unauthorized user", err})
  })
})

router.get('/:id',(req, res)=>{
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    if(decoded.isAdmin){
      Contact.findOne({_id: req.params.id}).then((data)=>{
        res.status(200).json({data})
      }).catch((err) => {
        res.status(500).json({msg : "Error from server", err})
      })
    }else{
      res.status(403).json({msg : "Only Admin can view this contact"})
    }
  }).catch((err)=>{
    res.status(403).json({msg : "Unauthorized user", err})
  })
})

router.delete('/:id',(req, res)=>{
  jwt.verify(req.header('Authorization'), secret).then((decoded)=>{
    if(decoded.isAdmin){
      Contact.deleteOne({_id: req.params.id}).then((data)=>{
        res.status(200).json({data})
      }).catch((err)=>{
        res.status(500).json({msg : "Error from server", err})
      })
    }else{  
      res.status(403).json({msg : "Only Admin can delete contacts"})
    }
  }).catch((err)=>{
    res.status(403).json({msg : "Unauthorized user", err})
  })
})



module.exports = router;