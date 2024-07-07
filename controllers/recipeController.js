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