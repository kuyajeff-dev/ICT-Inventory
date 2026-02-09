const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
// admin function
router.get('/users', assetController.getActUser);
router.post('/assets', assetController.submitAsset);

// user function that can store the personnel name in the database
router.get('/personnel',assetController.getPersonnel);
router.post('/userAssets',assetController.submitUserAsset);

module.exports = router;
