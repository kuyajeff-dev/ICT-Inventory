const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.get('/onlyAdmins', sessionController.getAdminSession);
router.get('/userOnly',sessionController.getUserSession);

router.post('/logout', sessionController.logout);

module.exports = router;
