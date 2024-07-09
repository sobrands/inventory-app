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
  res.render("filmsim_form", { title: "Create Film Simulation" });
};

// Handle form submission
exports.createPost = [
  // Validate and sanitize
  body("name", "Genre name must be at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create new film-sim object
    const filmSim = new FilmSim({ name: req.body.name })

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      res.render("filmsim_form", {
        title: "Create Film Simulation",
        film_sim: filmSim,
        errors: errors.array()
      });
      return;
    } else {
      // Check if filmsim already exists
      const filmSimExists = await FilmSim.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      
      if (filmSimExists) {
        res.redirect(filmSimExists.url);
      } else {
        await filmSim.save();
        res.redirect(filmSim.url);
      }
    }
  })
];