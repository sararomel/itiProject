const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const article = require("../models/article.model");
const articleScema = mongoose.model("article.model");

router.get("/article", async (request, response) => {
  await article
    .find({})
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      response.json({ error });
    });
});

router.post("/article", (request, response) => {
  const article = new articleScema({
    _id: request.body._id,
    description: request.body.description,
    images: request.body.images,
    title: request.body.title,
    name: request.body.name,
    likes: request.body.likes,
    comments: request.body.comments,
    date: request.body.date,
  });
  article
    .save()
    .then(() => {
      response.redirect("/article");
    })
    .catch(() => {
      response.send("Error 404");
    });
});
