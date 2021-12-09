const mongoose = require("mongoose");

const schema = mongoose.Schema({
  date: Date,
  media_type: String,
  explanation: String,
  title: String,
  url: String,
  hdurl: String,
  copyright: String,
});

module.exports = mongoose.model("APOD", schema);
