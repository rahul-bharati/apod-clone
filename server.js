require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const morgan = require("morgan");
const routes = require("./router/routes");

const main = async () => {
  const PORT = process.env.PORT || 3000;
  const MONGO_URI =
    "mongodb+srv://apod-user:testuser@cluster0.y1ieq.mongodb.net/apod?retryWrites=true&w=majority";

  console.info("Connecting to mongo cluster..");
  await mongoose.connect(MONGO_URI); // connect to mongo cluster
  console.info("Connected to mongo cluster");

  const app = express(); // initialize express app
  app.use(morgan("combined")); // setup morgan for logging purpose

  app.use(express.static("./public"));

  app.engine("hbs", engine({ extname: ".hbs" }));
  app.set("view engine", "hbs");
  app.set("views", "./views");

  app.use(routes); // setup router for app

  // start listening to app
  app.listen(PORT, () => {
    console.info("App listening on Port: ", PORT);
  });
};

main().catch((err) => console.error(err));
