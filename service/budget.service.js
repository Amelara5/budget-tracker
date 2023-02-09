const BudgetRepo = require("../repo/budget.repo");
const Budget = require("../model/budget");

class BudgetService {
  constructor() {
    this.budgetRepo = new BudgetRepo();
  }

  async getBudget() {
    // console.log("GET-SERVICE is good");
    const data = await this.budgetRepo.getBudget();
    return data.rows;
  }

  async createBudget(value) {
    // console.log("POST-SERVICE is good");
    // console.log(value);
    const budget = new Budget(
      value.amount,
      value.type,
      value.description,
      value.date
    );
    // console.log(budget);
    await this.budgetRepo.createBudget(budget);
  }
}

module.exports = BudgetService;
