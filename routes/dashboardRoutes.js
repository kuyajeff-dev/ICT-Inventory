const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/assets', dashboardController.getAssets);

module.exports = router;
