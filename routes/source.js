const express = require("express");
const router = express.Router();

const sourceController = require("../controllers/sourceController");

// Get list of sources
router.get("/", sourceController.index);

// Get individual source detail
router.get("/:id", sourceController.detail);

module.exports = router;