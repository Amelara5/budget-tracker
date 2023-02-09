const pool = require("../utils/pool");

class BudgetRepo {
  constructor() {}

  async getBudget() {
    // console.log("GET-REPO is good");
    return await pool.query("SELECT * FROM budget");
  }

  async createBudget(budget) {
    // console.log("POST-REPO is good");
    return await pool.query(
      "INSERT INTO budget (amount, type, description, date) VALUES ($1, $2, $3, $4)",
      [budget.amount, budget.type, budget.description, budget.date]
    );
  }
}

module.exports = BudgetRepo;
