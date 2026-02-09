const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.get('/users', userController.getUsers);
router.post('/users', upload.single('avatar'), userController.addUser);
router.put('/users/:employeeId/status', userController.updateUserStatus);


module.exports = router;
