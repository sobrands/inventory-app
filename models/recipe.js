const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: { type: String, required: true },
  film_sim: { type: Schema.Types.ObjectId, ref: "FilmSim", required: true },
  settings: {
    dynamic_range: { 
      type: String, 
      required: true,
      enum: ["DR-Auto", "DR100", "DR200", "DR400"] 
    },
    grain: {
      type: String,
      required: true,
      enum: ["Off", "Strong Small", "Strong Large", "Weak Small", "Weak Large", "Strong", "Weak"]
    },
    ccfx: {
      type: String,
      required: true,
      enum: ["Strong", "Weak", "Off"]
    },
    ccfx_blue: {
      type: String,
      required: true,
      enum: ["Strong", "Weak", "Off"]
    },
    white_balance: {
      style: { type: String, required: true },
      shift: {
        red: { type: Number, required: true },
        blue: { type: Number, required: true }
      }
    },
    highlight: { type: Number, required: true },
    shadow: { type: Number, required: true },
    sharpness: { type: Number, required: true },
    noise_reduction: { type: Number, required: true },
    clarity: { type: Number, required: true },
    iso: { type: Number, required: true },
    exposure_compensation: {
      min: String,
      max: String
    }
  },
  source: { type: Schema.Types.ObjectId, ref: "Source" , required: true},
  reference_url: String
});

RecipeSchema.virtual("url").get(function () {
  return `/recipe/${this._id}`;
});

module.exports = mongoose.model("Recipe", RecipeSchema);