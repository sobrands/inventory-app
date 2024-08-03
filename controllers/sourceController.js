const dbSource = require("../db/sourceQueries");
const dbRecipe = require("../db/recipeQueries");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of sources  
exports.index = asyncHandler(async (req, res, next) => {
  const result = await dbSource.getAllSources();
  const sources = result.map((source) => {
    return {
      ...source,
      url: `/source/${source.id}`
    };
  });

  res.render("source_list", {
    title: "Sources",
    source_list: sources
  });
});

// Display recipes belonging to source
exports.detail = asyncHandler(async (req, res, next) => {
  const [ source, recipesBySource ] = await Promise.all([
    dbSource.getSourceById(req.params.id),
    dbRecipe.getRecipesFromSource(req.params.id)
  ]);

  if (source.length === 0) {
    const err = new Error("Source not found!");
    err.status = 404;
    return next(err);
  }

  // Populate recipe with its url
  const recipes = recipesBySource.map((recipe) => {
    return {
      ...recipe,
      url: `/recipe/${recipe.id}`
    };
  });

  res.render("source_detail", {
    title: source[0].name,
    source: source[0],
    recipe_list: recipes
  });
});

// Display form to create source
exports.createGet = (req, res, next) => {
  res.render("source_form", { title: "Create Source" });
};

// Submit form to create source
exports.createPost = [
  body("name", "Source name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description")
    .trim()
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create new source object
    const source = {
      name: req.body.name,
      description: req.body.description
    };

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      res.render("source_form", {
        title: "Create Source",
        source: source,
        errors: errors.array()
      });
      return;
    } else {
        await dbSource.createSource(source);
        res.redirect("/sources");
      }
    })
];

// Display form to update source
exports.updateGet = asyncHandler(async (req, res, next) => {
  const source = await dbSource.getSourceById(req.params.id);

  if (source.length === 0) {
    const err = new Error("Source cannot be found!");
    err.status = 404;
    return next(err);
  }

  res.render("source_form", {
    title: "Update Source",
    source: source[0]
  });
});

// Submit form to update source
exports.updatePost = [
  body("name", "Source name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description")
    .trim()
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create new source object
    const source = {
      name: req.body.name,
      description: req.body.description,
    };

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      res.render("source_form", {
        title: "Update Source",
        source: source,
        errors: errors.array()
      });
      return;
    } else {
      await dbSource.updateSource(req.params.id, source);
      res.redirect(`/source/${req.params.id}`);
    }
  })
];

exports.deleteGet = asyncHandler(async (req, res, next) => {
  const [ source, recipesBySource ] = await Promise.all([
    dbSource.getSourceById(req.params.id),
    dbRecipe.getRecipesFromSource(req.params.id)
  ]);

  if (source.length === 0) {
    res.redirect("/sources");
  }

  // Populate recipe with its url
  const recipes = recipesBySource.map((recipe) => {
    return {
      ...recipe,
      url: `/recipe/${recipe.id}`
    };
  });

  res.render("source_delete", {
    title: "Delete Source",
    source: source[0],
    recipe_list: recipes
  });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const [ source, recipesBySource ] = await Promise.all([
    dbSource.getSourceById(req.params.id),
    dbRecipe.getRecipesFromSource(req.params.id)
  ]);

  if (source.length === 0) {
    res.redirect("/sources");
  }

  // Populate recipe with its url
  const recipes = recipesBySource.map((recipe) => {
    return {
      ...recipe,
      url: `/recipe/${recipe.id}`
    };
  });

  if (recipes.length > 0) {
    res.render("source_delete", {
      title: "Delete Source",
      source: source[0],
      recipe_list: recipes
    });
    return;
  } else {
    await dbSource.deleteSource(req.body.sourceid);
    res.redirect("/sources");
  }
});