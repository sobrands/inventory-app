require("dotenv").config();

const Recipe = require("./models/recipe");
const FilmSim = require("./models/film-sim");
const Source = require("./models/source");

const filmSims = [];
const sources = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wvjemnw.mongodb.net/inventory-app?retryWrites=true&w=majority&appName=Cluster0`

main().catch((err) => console.log(err));

async function main() {
  console.log("About to connect to MongoDB...");
  await mongoose.connect(mongoDB);
  console.log("Connected!");
  await createFilmSims();
  await createSources();
  await createRecipes();
  console.log("Closing mongoose");
  mongoose.connection.close();
}

async function filmSimCreate(index, name) {
  // Check if filmSim exists in DB first
  const filmSim = await FilmSim.find({ name: name }).exec();

  if (filmSim.length > 0) {
    console.log(`${name} already exists!`);
  } else {
    const sim = new FilmSim({ name: name });
    await sim.save();
    filmSims[index] = sim;
    console.log(`Added Film Simulation: ${name}`);
  } 
}

async function sourceCreate(index, name, desc) {
  // Check if source exists in DB first
  const source = await Source.find({ name: name }).exec();

  if (source.length > 0) {
    console.log(`${name} already exists!`);
  } else {
    const src = new Source({
      name: name,
      description: desc
    });
    await src.save();
    sources[index] = src;
    console.log(`Added source: ${name}`);
  }
}

async function recipeCreate(index, name, filmSim, settings, source) {
  const recipe = new Recipe({
    name: name,
    film_sim: filmSim,
    settings: settings,
    source: source
  });
  await recipe.save();
  console.log(`Added recipe: ${name}`);
}

async function createFilmSims() {
  console.log("Adding film simulations");
  await Promise.all([
    filmSimCreate(0, "Classic Chrome"),
    filmSimCreate(1, "Nostalgic Negative"),
    filmSimCreate(2, "Classic Negative")
  ]);
}

async function createSources() {
  console.log("Adding sources");
  await Promise.all([
    sourceCreate(0, "FujiXWeekly", "Goated Recipe Platform"),
    sourceCreate(1, "CaptnLook", "Cinematic Film Presets")
  ]);
}

async function createRecipes() {
  console.log("Adding Recipes");
  await recipeCreate(0, "Kodak Gold 200", filmSims[0], {
    dynamic_range: "DR-Auto",
    grain: "Strong",
    ccfx: "Off",
    ccfx_blue: "Off",
    white_balance: {
      style: "Daylight",
      shift: {
        red: 4,
        blue: -5
      }
    },
    highlight: -2,
    shadow: 1,
    color: 3,
    sharpness: -2,
    noise_reduction: -4,
    clarity: 0,
    iso: 6400,
    exposure_compensation: {
      min: "2/3",
      max: "1 1/3"
    },
  },
  sources[0])
}