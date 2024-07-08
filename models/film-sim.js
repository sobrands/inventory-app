const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FilmSimSchema = new Schema({
  name: { type: String, required: true }
});

// Virtual for URL
FilmSimSchema.virtual("url").get(function () {
  return `/film-sims/${this._id}`;
});

// Export model
module.exports = mongoose.model("FilmSim", FilmSimSchema);