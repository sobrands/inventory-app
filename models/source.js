const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SourceSchema = new Schema({
  name: { type: String, required: true },
  description: String,
});

// Virtual for URL
SourceSchema.virtual("url").get(function () {
  return `/source/${this._id}`;
});

// Export model
module.exports = mongoose.model("Source", SourceSchema);