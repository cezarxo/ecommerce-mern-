const Feature = require("../../models/Feature");

const addFeatureImg = async (req, res) => {
  try {
    const { image } = req.body;

    const featureImg = new Feature({ image });

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    await featureImg.save();

    res.status(201).json({
      success: true,
      data: featureImg,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getFeatureImgs = async (req, res) => {
  try {
    const featureImgs = await Feature.find({});

    res.status(200).json({
      success: true,
      data: featureImgs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteFeatureImg = async (req, res) => {
  try {
    const { id } = req.params;
    const featureImg = await Feature.findByIdAndDelete(id);

    if (!featureImg) {
      return res.status(404).json({
        success: false,
        message: "Feature Image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feature Image deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { addFeatureImg, getFeatureImgs, deleteFeatureImg };
