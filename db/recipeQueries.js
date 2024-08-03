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

module.exports = {
  getRecipesFromSource,
}