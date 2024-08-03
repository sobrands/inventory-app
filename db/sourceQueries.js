const pool = require("./pool");

async function getAllSources() {
  const { rows } = await pool.query("SELECT * FROM sources ORDER BY name");
  return rows;
}

async function getSourceById(id) {
  const { rows } = await pool.query("SELECT * FROM sources WHERE id = ($1)", [id]);
  return rows;
}

async function createSource(source) {
  await pool.query(`
    INSERT INTO sources (name, description)
    VALUES (($1), ($2))
  `, [source.name, source.description]);
}

async function updateSource(id, source) {
  await pool.query(`
    UPDATE sources
    SET name = ($1),
        description = ($2)
    WHERE id = ($3)
  `, [source.name, source.description, id]);
}

async function deleteSource(id) {
  await pool.query(`
    DELETE FROM sources
    WHERE id = ($1)
  `, [id]);
}

module.exports = {
  getAllSources,
  getSourceById,
  createSource,
  updateSource,
  deleteSource,
}