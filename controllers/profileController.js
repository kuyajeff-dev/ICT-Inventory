const assetModel = require("../models/assetModel");
const personnelModel = require("../models/personnelModel");
const userModel = require("../models/userModel");

exports.getUserProfileData = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const [user, assets, personnelList] = await Promise.all([
      userModel.getById(userId),
      assetModel.getAssetsByUser(userId), // ← also fixed
      personnelModel.getPersonnelByUser(userId)
    ]);

    res.json({
      success: true,
      data: {
        user,
        assets,
        personnel: personnelList
      }
    });

  } catch (err) {
    next(err);
  }
};

exports.getPersonnelAssets = async (req, res) => {
  try {
    const personnelId = req.params.id;

    if (!personnelId) {
      return res.status(400).json({ success: false, message: "Personnel ID required" });
    }

    const [assets, personnel] = await Promise.all([
      assetModel.getAssetsByPersonnel(personnelId),
      personnelModel.getPersonnelById(personnelId)   // new function
    ]);

    res.json({
      success: true,
      assets,
      personnel
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

