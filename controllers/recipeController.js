const Recipe = require("../models/recipe");
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