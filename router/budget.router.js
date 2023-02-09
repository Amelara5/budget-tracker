const express = require("express");
const BudgetController = require("../controller/budget.controller");

const budgetController = new BudgetController();
const budgetRouter = express.Router();

budgetRouter.get("/budget", (req, res) => {
  // console.log("GET-ROUTER is good");
  budgetController.getBudget(req, res);
});

budgetRouter.post("/budget", (req, res) => {
  // console.log("POST-ROUTER is good");
  budgetController.createBudget(req, res);
});

module.exports = budgetRouter;
