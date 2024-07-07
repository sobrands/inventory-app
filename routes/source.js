const express = require("express");
const router = express.Router();

const sourceController = require("../controllers/sourceController");

router.get("/", sourceController.index);

module.exports = router;