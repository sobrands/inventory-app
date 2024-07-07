const FilmSim = require("../models/film-sim");
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