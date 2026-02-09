const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

router.get("/profile", profileController.getUserProfileData);
router.get("/personnel/:id/assets", profileController.getPersonnelAssets);

module.exports = router;
