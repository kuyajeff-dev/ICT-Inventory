const assetModel = require("../models/assetModel");
const personnelModel = require("../models/personnelModel");

exports.getAllPersonnel = async (req, res) => {
  const status = req.query.status || "";
  const userId = req.query.userId;
  const data = await personnelModel.getAllPersonnel(status, userId);
  res.json({ success: true, data });
};

exports.getAllAssets = async (req, res) => {
  const status = req.query.status || "";
  const userId = req.query.userId;
  try {
    const data = await assetModel.getAllAssets(status, userId);
    res.json({ success: true, data });
  } catch (err) {
    console.error("GET ALL ASSETS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await assetModel.getAssetById(id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePersonnel = async (req, res) => {
  const { id, status } = req.body;
  try {
    await personnelModel.updatePersonnel(id, status);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAssets = async (req, res) => {
  const { id, transferTo, condition, status } = req.body;

  if (!id || !condition || !status) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  try {
    await assetModel.updateAssetFull(
      Number(id),
      transferTo,
      condition,
      status
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE ASSET ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAssetSummary = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const data = await assetModel.getAssetSummary(userId);
    res.json({ success: true, data });
  } catch (err) {
    console.log("SUMMARY ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
