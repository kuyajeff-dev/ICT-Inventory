const assetModel = require('../models/assetModel');

exports.getAssets = async (req, res) => {
  try {
    const assets = await assetModel.getAsset();
    console.log("Assets fetched:", assets.length);
    res.json({ success: true, data: assets });
  } catch (err) {
    console.error("ERROR in getAssets:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
