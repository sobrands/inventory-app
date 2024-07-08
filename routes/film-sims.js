const express = require("express");
const router = express.Router();

const filmSimsController = require("../controllers/filmSimController")

// Get index page
router.get("/", filmSimsController.index);

// Get recipes per film sim
router.get("/:id", filmSimsController.detail)

module.exports = router;