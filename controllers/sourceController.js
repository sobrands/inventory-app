const Source = require("../models/source");
const Recipe = require("../models/recipe");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of sources  
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

  if (source === null) {
    const err = new Error("Source not found!");
    err.status = 404;
    return next(err);
  }

  res.render("source_detail", {
    title: source.name,
    source: source,
    recipe_list: recipesBySource
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
    const source = new Source({
      name: req.body.name,
      description: req.body.description
    });

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      res.render("source_form", {
        title: "Create Source",
        source: source,
        errors: errors.array()
      });
      return;
    } else {
      // Check if filmsim already exists
      const sourceExists = await Source.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      
      if (sourceExists) {
        res.redirect(sourceExists.url);
      } else {
        await source.save();
        res.redirect(source.url);
      }
    }
  })
];

// Display form to update source
exports.updateGet = asyncHandler(async (req, res, next) => {
  const source = await Source.findById(req.params.id).exec();

  if (source === null) {
    const err = new Error("Source cannot be found!");
    err.status = 404;
    return next(err);
  }

  res.render("source_form", {
    title: "Update Source",
    source: source
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
    const source = new Source({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      res.render("source_form", {
        title: "Update Source",
        source: source,
        errors: errors.array()
      });
      return;
    } else {
      const updatedSource = await Source.findByIdAndUpdate(req.params.id, source, {});
      res.redirect(updatedSource.url);
    }
  })
];

exports.deleteGet = asyncHandler(async (req, res, next) => {
  const [source, recipesBySource] = await Promise.all([
    Source.findById(req.params.id).exec(),
    Recipe.find({ source: req.params.id }, "name").sort({ name: 1 }).exec()
  ]);

  if (source === null) {
    res.redirect("/sources");
  }

  res.render("source_delete", {
    title: "Delete Source",
    source: source,
    recipe_list: recipesBySource
  });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const [source, recipesBySource] = await Promise.all([
    Source.findById(req.params.id).exec(),
    Recipe.find({ source: req.params.id }, "name").sort({ name: 1 }).exec()
  ]);

  if (source === null) {
    res.redirect("/sources");
  }

  if (recipesBySource.length > 0) {
    res.render("source_delete", {
      title: "Delete Source",
      source: source,
      recipe_list: recipesBySource
    });
    return;
  } else {
    await Source.findByIdAndDelete(req.body.sourceid);
    res.redirect("/sources");
  }
});