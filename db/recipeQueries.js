const pool = require("./pool");

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
  getRecipesFromSource,
  getRecipesFromFilmSim,
  
}