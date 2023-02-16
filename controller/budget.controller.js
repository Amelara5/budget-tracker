const BudgetService = require("../service/budget.service");

class BudgetController {
  constructor() {
    this.budgetService = new BudgetService();
  }

  async getBudget(req, res) {
    try {
      // console.log("GET-CONTROLLER is good");
      const data = await this.budgetService.getBudget();
      console.log("*------------*");
      return res.json({
        status: 200,
        message: data,
      });
    } catch (err) {
      console.log("Error at GET-CONTROLLER");
      console.log(err);
      res.send("Error: ", err);
    }
  }

  async createBudget(req, res) {
    try {
      const value = req.body;
      // console.log("POST-CONTROLLER is good");
      const response = await this.budgetService.createBudget(value);
      res.status(200).json({
        status: "Succesfull",
        message: "POST was good.",
        response,
      });
    } catch (err) {
      console.log("Error at POST-CONTROLLER");
      console.log(err);
      res.send("Error: ", err);
    }
  }

  async deleteBudgetLine(req, res) {
    try {
      const id = parseInt(req.params.id);
      // console.log("DELETE-CONTROLLER is good", id);
      await this.budgetService.deleteBudgetLine(id);
      res.status(200).json({
        status: "Succesfull",
        message: "Delete was good.",
      });
    } catch (err) {
      console.log("Error at DELETE-CONTROLLER");
      console.log(err);
      res.send("Error: ", err);
    }
  }
}

module.exports = BudgetController;
