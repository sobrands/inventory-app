const express = require("express");
const router = express.Router();

const recipeController = require("../controllers/recipeController");

// Display list of recipes
router.get("/", recipeController.index);

// Display recipe details
router.get("/:id", recipeController.detail);

module.exports = router;