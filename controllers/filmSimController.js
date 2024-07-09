const FilmSim = require("../models/film-sim");
const Recipe = require("../models/recipe");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of Film Simulation  
exports.index = asyncHandler(async (req, res, next) => {
  const filmSims = await FilmSim.find().sort({ name: 1 }).exec();

  res.render("filmsim_list", {
    title: "Film Simulations",
    filmsim_list: filmSims
  });
});

// Display recipes per Film Simulation
exports.detail = asyncHandler(async (req, res, next) => {
  const [filmSim, recipesByFilmSim] = await Promise.all([
    FilmSim.findById(req.params.id),
    Recipe.find({ film_sim: req.params.id }, "name").sort({ name: 1 }).exec()
  ]);
  
  res.render("filmsim_detail", {
    title: filmSim.name,
    recipe_list: recipesByFilmSim
  });
});

// Display form to create Film Simulation
exports.createGet = (req, res, next) => {
  console.log("here");
  res.send(200);
  // res.render("filmsim_form", { title: "Create Film Simulation" });
};