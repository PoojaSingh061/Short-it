const mongoose = require("mongoose");
const shortid = require("shortid");

//creating columns and specifying their types
const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: shortid.generate,
  },
});

// model => hooks database to the model (shortURLSchema) created
module.exports = mongoose.model("ShortUrl", shortUrlSchema);
