const express = require("express");
const {
  getFeatureImgs,
  addFeatureImg,
  deleteFeatureImg,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.get("/get", getFeatureImgs);
router.post("/add", addFeatureImg);
router.delete("/delete/:id", deleteFeatureImg);
module.exports = router;
