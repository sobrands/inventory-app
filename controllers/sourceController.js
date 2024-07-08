const Source = require("../models/source");
const Recipe = require("../models/recipe");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of Film Simulation  
exports.index = asyncHandler(async (req, res, next) => {
  const sources = await Source.find().sort({ name: 1 }).exec();

  res.render("source_list", {
    title: "Sources",
    source_list: sources
  });
});

// Display recipes belonging to source
exports.detail = asyncHandler(async (req, res, next) => {
  const [source, recipesBySource] = await Promise.all([
    Source.findById(req.params.id),
    Recipe.find({ source: req.params.id }, "name").sort({ name: 1 }).exec()
  ]);

  res.render("source_detail", {
    title: source.name,
    source: source,
    recipe_list: recipesBySource
  });
});