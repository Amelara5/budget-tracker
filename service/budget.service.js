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
    const budget = new Budget(
      value.amount,
      value.type,
      value.description,
      value.date
    );
    return await this.budgetRepo.createBudget(budget);
  }

  async deleteBudgetLine(id) {
    // console.log("DELETE-SERVICE is good", id);
    return await this.budgetRepo.deleteBudgetLine(id);
  }
}

module.exports = BudgetService;
