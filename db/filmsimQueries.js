const pool = require("./pool");

async function getAllFilmSims() {
  const { rows } = await pool.query(`
    SELECT * FROM film_sims
    ORDER BY name
  `);

  return rows;
}

async function getFilmSimById(id) {
  const { rows } = await pool.query(`
    SELECT * FROM film_sims
    WHERE id = ($1)
  `, [id]);

  return rows;
}

async function createFilmSim(filmSim) {
  await pool.query(`
    INSERT INTO film_sims (name)
    VALUES (($1))
  `, [filmSim.name]);
}

async function updateFilmSim(id, filmSim) {
  await pool.query(`
    UPDATE film_sims
    SET name = ($1)
    WHERE id = ($2)
  `, [filmSim.name, id]);
}

async function deleteFilmSim(id) {
  await pool.query(`
    DELETE FROM film_sims
    WHERE id = ($1)
  `, [id]);
}

module.exports = {
  getAllFilmSims,
  getFilmSimById,
  createFilmSim,
  updateFilmSim,
  deleteFilmSim,
}