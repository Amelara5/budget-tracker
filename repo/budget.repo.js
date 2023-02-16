const pool = require("../utils/pool");

class BudgetRepo {
  constructor() {}

  async getBudget() {
    // console.log("GET-REPO is good");
    return await pool.query("SELECT * FROM tracker");
  }

  async createBudget(budget) {
    // console.log("POST-REPO is good");
    return await pool.query(
      "INSERT INTO tracker (amount, type, description, date) VALUES ($1, $2, $3, $4)",
      [budget.amount, budget.type, budget.description, budget.date]
    );
  }

  async deleteBudgetLine(id) {
    // console.log("DELETE-REPO is good", id);
    return await pool.query("DELETE FROM tracker WHERE id = $1", [id]);
  }
}

module.exports = BudgetRepo;
