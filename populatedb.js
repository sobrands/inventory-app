require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS film_sims (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  film_sim INTEGER REFERENCES film_sims (id),
  dynamic_range TEXT NOT NULL,
  grain TEXT NOT NULL,
  ccfx TEXT NOT NULL,
  ccfx_blue TEXT NOT NULL,
  highlight INTEGER NOT NULL,
  shadow INTEGER NOT NULL,
  wb_style TEXT NOT NULL,
  wb_shift_red INTEGER NOT NULL,
  wb_shift_blue INTEGER NOT NULL,
  sharpness INTEGER NOT NULL,
  noise_reduction INTEGER NOT NULL,
  clarity INTEGER NOT NULL,
  iso INTEGER NOT NULL,
  exposure_compensation_min TEXT NOT NULL,
  exposure_compensation_max TEXT NOT NULL,
  source INTEGER REFERENCES sources (id),
  reference_url TEXT
);

INSERT INTO sources (name, description)
VALUES 
  ('FujiXWeekly', 'Goated Recipe Platform'),
  ('CaptnLook', 'Cinematic Film Presets');

INSERT INTO film_sims (name)
VALUES 
  ('Classic Chrome'),
  ('Nostalgic Negative'),
  ('Classic Negative');

INSERT INTO recipes (name, film_sim, dynamic_range, grain,
  ccfx, ccfx_blue, wb_style, wb_shift_red, wb_shift_blue,
  highlight, shadow, sharpness, noise_reduction, clarity, iso,
  exposure_compensation_min, exposure_compensation_max, source
)
VALUES
  ('Kodak Gold 200', (SELECT id FROM film_sims WHERE name = 'Classic Chrome'),
   'DR-Auto', 'Strong', 'Off', 'Off', 'Daylight', 4, -5, -2, 1, -2, -4, 0,
   6400, '2/3', '1 1/3', (SELECT id FROM sources WHERE name = 'FujiXWeekly')
  );
`

async function main() {
  console.log("About to connect to Postgres DB...");
  const client = new Client({
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/inventory_app`
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main().catch((err) => console.log(err));