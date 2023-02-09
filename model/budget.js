class Budget {
  constructor(amount, type, description = null, date = null) {
    this.amount = amount;
    this.type = type;
    this.description = description;
    this.date = date;
  }
}

module.exports = Budget;
