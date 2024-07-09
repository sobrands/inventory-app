const express = require('express');
const router = express.Router();

const filmSimController = require("../controllers/filmSimController")
const recipeController = require("../controllers/recipeController");
const sourceController = require("../controllers/sourceController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fujifilm Cookbook' });
});

// FILM SIMULATION ROUTES //

// Get create form
router.get("/film-sim/create", filmSimController.createGet);

// Submit create form
router.post("/film-sim/create", filmSimController.createPost);

// Get Film Sim list
router.get("/film-sims", filmSimController.index);

// Get recipes per film sim
router.get("/film-sim/:id", filmSimController.detail)

// RECIPE ROUTES //

// Display list of recipes
router.get("/recipes", recipeController.index);

// Display recipe details
router.get("/recipe/:id", recipeController.detail);

// SOURCE ROUTES //

// Get list of sources
router.get("/sources", sourceController.index);

// Get individual source detail
router.get("/source/:id", sourceController.detail);

module.exports = router;
