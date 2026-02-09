const express = require("express");
const router = express.Router();
const personnelController = require("../controllers/personnelController");

router.post("/add", personnelController.addPersonnel);

module.exports = router;
