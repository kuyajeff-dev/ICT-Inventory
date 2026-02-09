const assetModel = require('../models/assetModel');
const UserModel = require('../models/userModel');
const personnelModel = require('../models/personnelModel');

exports.getActUser = async (req, res) => {
  try {
    const users = await UserModel.getActiveUser();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.getPersonnel = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const personnel = await personnelModel.getPersonnel(userId);
    res.json(personnel);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch Personnel' });
  }
}

exports.submitAsset = async (req, res) => {
  try {
    const data = req.body;

    if (!data.property_no || !data.serial_no || !data.item_name) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const asset = await assetModel.createAsset(data);

    res.status(201).json({
      message: "Asset successfully created",
      asset
    });
  } catch (err) {
    console.error(err); // 👈 this shows the real error in terminal
    res.status(500).json({ message: "Failed to save asset", error: err.message });
  }
};

exports.submitUserAsset = async (req, res) => {
  try {
    const data = req.body;

    if (!data.property_no || !data.serial_no || !data.item_name) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const asset = await assetModel.createUserAsset(data);

    res.status(201).json({
      message: "Asset successfully created",
      asset
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save asset", error: err.message });
  }
};
