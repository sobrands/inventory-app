const dbRecipe = require("../db/recipeQueries");
const dbSource = require("../db/sourceQueries");
const dbFilmSim = require("../db/filmsimQueries");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of Film Simulation  
exports.index = asyncHandler(async (req, res, next) => {
  const result = await dbRecipe.getAllRecipes();

  // Populate recipes with url
  const recipes = result.map((recipe) => {
    return {
      ...recipe,
      url: `/recipe/${recipe.id}`
    };
  });

  res.render("recipe_list", {
    title: "Recipes",
    recipe_list: recipes
  });
});

exports.detail = asyncHandler(async (req, res, next) => {
  const result = await dbRecipe.getRecipeById(req.params.id);

  // Populate url
  const recipe = {
    ...result[0],
    film_sim_url: `/film-sim/${result[0].film_sim}`,
    source_url: `/source/${result[0].source}`
  }

  res.render("recipe_detail", {
    title: recipe.name,
    recipe: recipe
  });
});

exports.createGet = asyncHandler(async (req, res, next) => {
  const [sources, filmsims] = await Promise.all([
    dbSource.getAllSources(),
    dbFilmSim.getAllFilmSims()
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
    const recipe = {
      name: req.body.name,
      film_sim: req.body.film_sim,
      dynamic_range: req.body.dynamic_range,
      grain: req.body.grain,
      ccfx: req.body.ccfx,
      ccfx_blue: req.body.ccfx_blue,
      wb_style: req.body.style,
      wb_shift_red: req.body.red,
      wb_shift_blue: req.body.blue,
      highlight: req.body.highlight,
      shadow: req.body.shadow,
      sharpness: req.body.sharpness,
      noise_reduction: req.body.nr,
      clarity: req.body.clarity,
      iso: req.body.iso,
      exposure_compensation_min: req.body.min,
      exposure_compensation_max: req.body.max,
      source: req.body.source,
      reference_url: req.body.reflink
    };

    if (!errors.isEmpty()) {
      const [sources, filmsims] = await Promise.all([
        dbSource.getAllSources(),
        dbFilmSim.getAllFilmSims()
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
      await dbRecipe.createRecipe(recipe);
      res.redirect("/recipes");
    }
  })
];

exports.updateGet = asyncHandler(async (req, res, next) => {
  const [
    sources, 
    filmsims,
    recipe
  ] = await Promise.all([
    dbSource.getAllSources(),
    dbFilmSim.getAllFilmSims(),
    dbRecipe.getRecipeById(req.params.id)
  ]);

  if (recipe.length === 0) {
    const err = new Error("Recipe cannot be found!");
    err.status = 404;
    return next(err);
  }

  res.render("recipe_form", {
    title: "Update Recipe",
    recipe: recipe[0],
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
    const recipe = {
      name: req.body.name,
      film_sim: req.body.film_sim,
      dynamic_range: req.body.dynamic_range,
      grain: req.body.grain,
      ccfx: req.body.ccfx,
      ccfx_blue: req.body.ccfx_blue,
      wb_style: req.body.style,
      wb_shift_red: req.body.red,
      wb_shift_blue: req.body.blue,
      highlight: req.body.highlight,
      shadow: req.body.shadow,
      sharpness: req.body.sharpness,
      noise_reduction: req.body.nr,
      clarity: req.body.clarity,
      iso: req.body.iso,
      exposure_compensation_min: req.body.min,
      exposure_compensation_max: req.body.max,
      source: req.body.source,
      reference_url: req.body.reflink
    };

    if (!errors.isEmpty()) {
      const [sources, filmsims] = await Promise.all([
        dbSource.getAllSources(),
        dbFilmSim.getAllFilmSims(),
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
      await dbRecipe.updateRecipe(req.params.id, recipe);
      res.redirect(`/recipe/${req.params.id}`);
    }
  })
]

exports.deleteGet = asyncHandler(async (req, res, next) => {
  const recipe = await dbRecipe.getRecipeById(req.params.id);

  if (recipe.length === 0) {
    res.redirect("/recipes");
  }

  res.render("recipe_delete", { 
    title: "Delete Recipe",
    recipe: recipe[0]
  });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const recipe = await dbRecipe.getRecipeById(req.params.id);

  if (recipe.length === 0) {
    res.redirect("/recipes");
  } else {
    await dbRecipe.deleteRecipe(req.body.recipeid);
    res.redirect("/recipes");
  }
});