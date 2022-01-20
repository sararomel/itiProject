let express = require("express");
let CropsRouter = express.Router();
let mongoose = require("mongoose");
let cropsController = require("../controler/cropsController");
require("../models/Crops");


CropsRouter.route("/")
  .get(cropsController.getAllCrops)
  .post(cropsController.AddCropName);


CropsRouter.route("/:id")
  .get(cropsController.findCropById)
  .delete(cropsController.deleteCropById)
  .patch(cropsController.updateCropById);

CropsRouter.route("/findByName/:name").get(cropsController.findCropByName);

CropsRouter.route("/typeId/:typeId")
  .get(cropsController.findCropByTypeId)

module.exports = CropsRouter;
