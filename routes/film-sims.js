const express = require("express");
const router = express.Router();

const filmSimsController = require("../controllers/filmSimController")

// Get index page
router.get("/", filmSimsController.index);

module.exports = router;