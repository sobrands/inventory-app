const dbFilmSim = require("../db/filmsimQueries");
const dbRecipe = require("../db/recipeQueries");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of Film Simulation  
exports.index = asyncHandler(async (req, res, next) => {
  const result = await dbFilmSim.getAllFilmSims();

  // Add url to list
  const filmSims = result.map((filmsim) => {
    return {
      ...filmsim,
      url: `/film-sim/${filmsim.id}`
    }
  });

  res.render("filmsim_list", {
    title: "Film Simulations",
    filmsim_list: filmSims
  });
});

// Display recipes per Film Simulation
exports.detail = asyncHandler(async (req, res, next) => {
  const [filmSim, recipesByFilmSim] = await Promise.all([
    dbFilmSim.getFilmSimById(req.params.id),
    dbRecipe.getRecipesFromFilmSim(req.params.id)
  ]);

  if (filmSim.length === 0) {
    const err = new Error("Film simulation not found!");
    err.status = 400;
    return next(err);
  }

  // Add url to recipes
  const recipes = recipesByFilmSim.map((recipe) => {
    return {
      ...recipe,
      url: `/recipe/${recipe.id}`
    }
  });
  
  res.render("filmsim_detail", {
    title: filmSim[0].name,
    film_sim: filmSim[0],
    recipe_list: recipes
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
    const filmSim = { name: req.body.name };

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      res.render("filmsim_form", {
        title: "Create Film Simulation",
        film_sim: filmSim,
        errors: errors.array()
      });
      return;
    } else {
      await dbFilmSim.createFilmSim(filmSim);
      res.redirect("/film-sims");
    }
  })
];

exports.updateGet = asyncHandler(async (req, res, next) => {
  const filmSim = await dbFilmSim.getFilmSimById(req.params.id);

  // Handle no results
  if (filmSim.length === 0) {
    const err = new Error("Film Simulation not found!");
    err.status = 404;
    return next(err);
  }

  res.render("filmsim_form", {
    title: "Update Film Simulation",
    film_sim: filmSim[0]
  });
});

exports.updatePost = [
  // Validate and sanitize
  body("name", "Genre name must be at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create new film-sim object
    const filmSim = { 
      name: req.body.name,
    };

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      res.render("filmsim_form", {
        title: "Update Film Simulation",
        film_sim: filmSim,
        errors: errors.array()
      });
      return;
    } else {
        await dbFilmSim.updateFilmSim(req.params.id, filmSim);
        res.redirect(`/film-sim/${req.params.id}`);
    }
  })
];

exports.deleteGet = asyncHandler(async (req, res, next) => {
  const [filmSim, recipesByFilmSim] = await Promise.all([
    dbFilmSim.getFilmSimById(req.params.id),
    dbRecipe.getRecipesFromFilmSim(req.params.id)
  ]);

  if (filmSim.length === 0) {
    res.redirect("/film-sims");
  }

  // Populate recipes with url
  const recipes = recipesByFilmSim.map((recipe) => {
    return {
      ...recipe,
      url: `/recipe/${recipe.id}`
    }
  });

  res.render("filmsim_delete", {
    title: "Delete Film Simulation",
    film_sim: filmSim[0],
    recipe_list: recipes
  });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const [filmSim, recipesByFilmSim] = await Promise.all([
    dbFilmSim.getFilmSimById(req.params.id),
    dbRecipe.getRecipesFromFilmSim(req.params.id)
  ]);

  if (filmSim.length === 0) {
    res.redirect("/film-sims");
  }

  // Populate recipes with url
  const recipes = recipesByFilmSim.map((recipe) => {
    return {
      ...recipe,
      url: `/recipe/${recipe.id}`
    }
  });

  if (recipes.length > 0) {
    res.render("filmsim_delete", {
      title: "Delete Film Simulation",
      film_sim: filmSim[0],
      recipe_list: recipes
    });
    return;
  } else {
    // Delete Film Simulation
    await dbFilmSim.deleteFilmSim(req.body.filmsimid);
    res.redirect("/film-sims");
  }
});