const express = require("express");
const bodyParser = require("body-parser");
const budgetRouter = require("../router/budget.router");

function server(app) {
  //   const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(express.static("client"));
  app.use(budgetRouter);

  //   return app;
}

module.exports = server;
