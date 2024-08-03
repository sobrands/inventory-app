const pool = require("./pool");

async function getAllRecipes() {
  const { rows } = await pool.query(`
    SELECT * FROM recipes
    ORDER BY name
  `);

  return rows;
}

async function getRecipeById(id) {
  const { rows } = await pool.query(`
    SELECT r.*, f.name AS film_sim_name, s.name AS source_name
    FROM recipes r
    JOIN film_sims f ON r.film_sim = f.id
    JOIN sources s ON r.source = s.id
    WHERE r.id = ($1)
  `, [id]);
  
  return rows;
}

async function createRecipe(recipe) {
  await pool.query(`
    INSERT INTO recipes (name, film_sim, dynamic_range, grain,
    ccfx, ccfx_blue, wb_style, wb_shift_red, wb_shift_blue,
    highlight, shadow, sharpness, noise_reduction, clarity, iso,
    exposure_compensation_min, exposure_compensation_max, source, reference_url)

    VALUES
      (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10),
       ($11), ($12), ($13), ($14), ($15), ($16), ($17), ($18), ($19))
  `, [recipe.name, recipe.film_sim, recipe.dynamic_range, recipe.grain,
    recipe.ccfx, recipe.ccfx_blue, recipe.wb_style, recipe.wb_shift_red,
    recipe.wb_shift_blue, recipe.highlight, recipe.shadow, recipe.sharpness,
    recipe.noise_reduction, recipe.clarity, recipe.iso, recipe.exposure_compensation_min,
    recipe.exposure_compensation_max, recipe.source, recipe.reference_url
  ]);
}

async function updateRecipe(id, recipe) {
  await pool.query(`
    UPDATE recipes
    SET 
      name = ($1),
      film_sim = ($2),
      dynamic_range = ($3),
      grain = ($4),
      ccfx = ($5),
      ccfx_blue = ($6),
      wb_style = ($7),
      wb_shift_red = ($8),
      wb_shift_blue = ($9),
      highlight = ($10),
      shadow = ($11),
      sharpness = ($12),
      noise_reduction = ($13),
      clarity = ($14),
      iso = ($15),
      exposure_compensation_min = ($16),
      exposure_compensation_max = ($17),
      source = ($18),
      reference_url = ($19)
    WHERE id = ($20)
  `, [recipe.name, recipe.film_sim, recipe.dynamic_range, recipe.grain,
    recipe.ccfx, recipe.ccfx_blue, recipe.wb_style, recipe.wb_shift_red,
    recipe.wb_shift_blue, recipe.highlight, recipe.shadow, recipe.sharpness,
    recipe.noise_reduction, recipe.clarity, recipe.iso, recipe.exposure_compensation_min,
    recipe.exposure_compensation_max, recipe.source, recipe.reference_url,
    id
  ]);
}

async function deleteRecipe(id) {
  await pool.query(`
    DELETE FROM recipes
    WHERE id = ($1)
  `, [id]);
}

async function getRecipesFromSource(sourceId) {
  const { rows } = await pool.query(`
    SELECT r.id, r.name
    FROM recipes r 
    JOIN sources s ON r.source = s.id
    WHERE s.id = ($1);
  `, [sourceId]);
  return rows;
}

async function getRecipesFromFilmSim(filmsimId) {
  const { rows } = await pool.query(`
    SELECT r.id, r.name
    FROM recipes r 
    JOIN film_sims f ON r.film_sim = f.id
    WHERE f.id = ($1);
  `, [filmsimId]);
  return rows;
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesFromSource,
  getRecipesFromFilmSim,
}