const express = require('express');
const router = express.Router();

const filmSimController = require("../controllers/filmSimController");
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
router.get("/film-sim/:id", filmSimController.detail);

// Get update form
router.get("/film-sim/:id/update", filmSimController.updateGet);

// Submit update form
router.post("/film-sim/:id/update", filmSimController.updatePost);

// Get delete form
router.get("/film-sim/:id/delete", filmSimController.deleteGet);

// Submit delete form
router.post("/film-sim/:id/delete", filmSimController.deletePost);

// RECIPE ROUTES //

// Get create form
router.get("/recipe/create", recipeController.createGet);

// Submit create form
router.post("/recipe/create", recipeController.createPost);

// Display list of recipes
router.get("/recipes", recipeController.index);

// Display recipe details
router.get("/recipe/:id", recipeController.detail);

// Get update form
router.get("/recipe/:id/update", recipeController.updateGet);

// Submit update form
router.post("/recipe/:id/update", recipeController.updatePost);

// Get delete form
router.get("/recipe/:id/delete", recipeController.deleteGet);

// Submit delete form
router.post("/recipe/:id/delete", recipeController.deletePost);

// SOURCE ROUTES //

// Get create form
router.get("/source/create", sourceController.createGet);

// Submit create form
router.post("/source/create", sourceController.createPost);

// Get list of sources
router.get("/sources", sourceController.index);

// Get individual source detail
router.get("/source/:id", sourceController.detail);

// Get update form
router.get("/source/:id/update", sourceController.updateGet);

// Submit update form
router.post("/source/:id/update", sourceController.updatePost);

// Get delete form
router.get("/source/:id/delete", sourceController.deleteGet);

// Submit delete form
router.post("/source/:id/delete", sourceController.deletePost);

module.exports = router;
