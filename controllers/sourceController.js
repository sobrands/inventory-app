const Source = require("../models/source");
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