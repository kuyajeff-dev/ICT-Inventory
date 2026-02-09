const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const userController = require('../controllers/userController');

router.post('/login',adminAuthController.userLogin);
router.get('/districts', userController.getDistricts);
router.get('/schools', userController.getSchoolsByDistrict);
router.post('/update-location', userController.updateLocation);


module.exports = router;