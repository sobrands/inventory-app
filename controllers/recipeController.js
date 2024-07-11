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
});

exports.createPost = [
  body("name", "Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("film_sim", "Film Simulation must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("dynamic_range", "Dynamic Range must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("grain", "Grain must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("ccfx", "CCFX must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("ccfx_blue", "CCFX Blue must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("highlight")
    .trim()
    .isNumeric()
    .isFloat({ min: -2, max: 4 })
    .toFloat(),
  body("shadow")
    .trim()
    .isNumeric()
    .isFloat({ min: -2, max: 4 })
    .toFloat(),
  body("style", "White Balance Style must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("red")
    .trim()
    .isNumeric()
    .isInt({ min: -8, max: 8 })
    .toInt(),
  body("blue")
    .trim()
    .isNumeric()
    .isInt({ min: -8, max: 8 })
    .toInt(),
  body("sharpness")
    .trim()
    .isNumeric()
    .isInt({ min: -4, max: 4 })
    .toInt(),
  body("nr")
    .trim()
    .isNumeric()
    .isInt({ min: -4, max: 4 })
    .toInt(),
  body("clarity")
    .trim()
    .isNumeric()
    .isInt({ min: -5, max: 5 })
    .toInt(),
  body("iso")
    .trim()
    .isNumeric()
    .isInt({ min: 100, max: 13200 })
    .toInt(),
  body("min")
    .trim()
    .blacklist(["<", ">"]),
  body("max")
    .trim()
    .blacklist(["<", ">"]),
  body("source", "Source must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("reflink")
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create new recipe object
    const recipe = new Recipe({
      name: req.body.name,
      film_sim: req.body.film_sim,
      settings: {
        dynamic_range: req.body.dynamic_range,
        grain: req.body.grain,
        ccfx: req.body.ccfx,
        ccfx_blue: req.body.ccfx_blue,
        white_balance: {
          style: req.body.style,
          shift: {
            red: req.body.red,
            blue: req.body.blue
          }
        },
        highlight: req.body.highlight,
        shadow: req.body.shadow,
        sharpness: req.body.sharpness,
        noise_reduction: req.body.nr,
        clarity: req.body.clarity,
        iso: req.body.iso,
        exposure_compensation: {
          min: req.body.min,
          max: req.body.max
        }
      },
      source: req.body.source,
      reference_url: req.body.reflink
    });

    if (!errors.isEmpty()) {
      const [sources, filmsims] = await Promise.all([
        Source.find({}, "name").sort({ name: 1 }).exec(),
        FilmSim.find({}, "name").sort({ name: 1 }).exec()
      ]);

      // Render form with sanitized values/error messages
      res.render("recipe_form", {
        title: "Create Recipe",
        recipe: recipe,
        source_list: sources,
        filmsim_list: filmsims,
        errors: errors.array()
      });
      return;
    } else {
      await recipe.save();
      res.redirect(recipe.url);
    }
  })
];

exports.updateGet = asyncHandler(async (req, res, next) => {
  const [
    sources, 
    filmsims,
    recipe
  ] = await Promise.all([
    Source.find({}, "name").sort({ name: 1 }).exec(),
    FilmSim.find({}, "name").sort({ name: 1 }).exec(),
    Recipe.findById(req.params.id)
      .populate("film_sim")
      .populate("source")
      .exec()
  ]);

  if (recipe === null) {
    const err = new Error("Recipe cannot be found!");
    err.status = 404;
    return next(err);
  }

  res.render("recipe_form", {
    title: "Update Recipe",
    recipe: recipe,
    source_list: sources,
    filmsim_list: filmsims
  });
});

exports.updatePost = [
  body("name", "Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("film_sim", "Film Simulation must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("dynamic_range", "Dynamic Range must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("grain", "Grain must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("ccfx", "CCFX must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("ccfx_blue", "CCFX Blue must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("highlight")
    .trim()
    .isNumeric()
    .isFloat({ min: -2, max: 4 })
    .toFloat(),
  body("shadow")
    .trim()
    .isNumeric()
    .isFloat({ min: -2, max: 4 })
    .toFloat(),
  body("style", "White Balance Style must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("red")
    .trim()
    .isNumeric()
    .isInt({ min: -8, max: 8 })
    .toInt(),
  body("blue")
    .trim()
    .isNumeric()
    .isInt({ min: -8, max: 8 })
    .toInt(),
  body("sharpness")
    .trim()
    .isNumeric()
    .isInt({ min: -4, max: 4 })
    .toInt(),
  body("nr")
    .trim()
    .isNumeric()
    .isInt({ min: -4, max: 4 })
    .toInt(),
  body("clarity")
    .trim()
    .isNumeric()
    .isInt({ min: -5, max: 5 })
    .toInt(),
  body("iso")
    .trim()
    .isNumeric()
    .isInt({ min: 100, max: 13200 })
    .toInt(),
  body("min")
    .trim()
    .blacklist(["<", ">"]),
  body("max")
    .trim()
    .blacklist(["<", ">"]),
  body("source", "Source must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("reflink")
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create new recipe object
    const recipe = new Recipe({
      _id: req.params.id,
      name: req.body.name,
      film_sim: req.body.film_sim,
      settings: {
        dynamic_range: req.body.dynamic_range,
        grain: req.body.grain,
        ccfx: req.body.ccfx,
        ccfx_blue: req.body.ccfx_blue,
        white_balance: {
          style: req.body.style,
          shift: {
            red: req.body.red,
            blue: req.body.blue
          }
        },
        highlight: req.body.highlight,
        shadow: req.body.shadow,
        sharpness: req.body.sharpness,
        noise_reduction: req.body.nr,
        clarity: req.body.clarity,
        iso: req.body.iso,
        exposure_compensation: {
          min: req.body.min,
          max: req.body.max
        }
      },
      source: req.body.source,
      reference_url: req.body.reflink
    });

    if (!errors.isEmpty()) {
      const [sources, filmsims] = await Promise.all([
        Source.find({}, "name").sort({ name: 1 }).exec(),
        FilmSim.find({}, "name").sort({ name: 1 }).exec()
      ]);

      // Render form with sanitized values/error messages
      res.render("recipe_form", {
        title: "Update Recipe",
        recipe: recipe,
        source_list: sources,
        filmsim_list: filmsims,
        errors: errors.array()
      });
      return;
    } else {
      const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, recipe, {});
      res.redirect(updatedRecipe.url);
    }
  })
]

exports.deleteGet = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id).exec();

  if (recipe === null) {
    res.redirect("/recipes");
  }

  res.render("recipe_delete", { 
    title: "Delete Recipe",
    recipe: recipe
  });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id).exec();

  if (recipe === null) {
    res.redirect("/recipes");
  } else {
    await Recipe.findByIdAndDelete(req.body.recipeid);
    res.redirect("/recipes");
  }
});