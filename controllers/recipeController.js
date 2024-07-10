const Recipe = require("../models/recipe");
const Source = require("../models/source");
const FilmSim = require("../models/film-sim");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of Film Simulation  
exports.index = asyncHandler(async (req, res, next) => {
  const recipes = await Recipe.find().sort({ name: 1 }).exec();

  res.render("recipe_list", {
    title: "Recipes",
    recipe_list: recipes
  });
});

exports.detail = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe
    .findById(req.params.id)
    .populate("film_sim")
    .populate("source", "name");

  res.render("recipe_detail", {
    title: recipe.name,
    recipe: recipe
  });
});

exports.createGet = asyncHandler(async (req, res, next) => {
  const [sources, filmsims] = await Promise.all([
    Source.find({}, "name").sort({ name: 1 }).exec(),
    FilmSim.find({}, "name").sort({ name: 1 }).exec()
  ]);

  res.render("recipe_form", {
    title: "Create Recipe",
    source_list: sources,
    filmsim_list: filmsims
  });
})