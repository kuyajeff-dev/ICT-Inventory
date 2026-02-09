const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
  cb(null, Date.now() + path.extname(file.originalname));
}
});
const upload = multer ({storage});

router.post('/adminRegister', upload.single('avatar'), adminAuthController.adminRegister);
router.post('/adminLogin', adminAuthController.adminLogin);
router.post('/verifyOtp', adminAuthController.verifyOtp);

module.exports = router;
