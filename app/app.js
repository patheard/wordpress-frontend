const express = require("express");
const { engine } = require("express-handlebars");
const templateHelpers = require("./utils/template-helpers");
const pageRoutes = require("./routes/pages");

function createApp() {
  const app = express();

  // Configure hanldlebars
  app.engine(
    "hbs",
    engine({
      extname: "hbs",
      helpers: templateHelpers,
    }),
  );
  app.set("view engine", "hbs");

  app.use(express.static("public"));
  app.use("/", pageRoutes);

  return app;
}

module.exports = createApp;
