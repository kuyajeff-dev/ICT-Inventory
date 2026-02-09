const express = require("express");
const router = express.Router();
const recordsController = require("../controllers/recordsController");

router.get("/assets", recordsController.getAllAssets);
router.get("/personnel", recordsController.getAllPersonnel);
router.get("/assets/summary", recordsController.getAssetSummary);
router.get("/assets/:id", recordsController.getAssetById);

router.put("/assets/update", recordsController.updateAssets);
router.put("/personnel/update", recordsController.updatePersonnel);

module.exports = router;
