const incomeBar = document.getElementById("income");
const expensesBar = document.getElementById("expenses");
const addButton = document.getElementById("add-button");
const minusButton = document.getElementById("minus-button");

const amount = document.getElementById("amount-input");
const expenses = document.getElementById("expenses-input");
const newBalance = document.getElementById("balance");

const amountDescription = document.getElementById("amount-des-input");
const expenseDescription = document.getElementById("income-exp-input");
let balance = 0;

const newsFooter = document.getElementById("footer");

//  "addButton" and "minusButton" are meant to differentiate is the post is going to be for
//  and income or espense. They both do the same.

//  Both will have a "package" that is just a variable with all the information necessary
//  to put in the body of the POST. Then it will update the balance shown  on the page with
//  the amount that was given.

//  "sendBudget" is used by both to do the POST. And finally it will reset the values from
//  the input to empty strings ("")
addButton.addEventListener("click", (e) => {
  console.log("income");
  const package = packageCreator("income");
  balance = balance + parseInt(amount.value);
  newBalance.innerHTML = "BALANCE: $" + balance.toLocaleString("en-US");
  if (package.amount > 0) {
    sendBudget(package);
    for (const value in package) {
      const column = value;
      const text = package[value];
      filter(column, text, "income");
    }
    deleteButton("income");
  }

  amount.value = "";
  amountDescription.value = "";
});

minusButton.addEventListener("click", (e) => {
  console.log("expense");
  const package = packageCreator("expense");
  balance = balance - parseInt(amount.value);
  newBalance.innerHTML = "BALANCE: $" + balance.toLocaleString("en-US");
  if (package.amount > 0) {
    sendBudget(package);
    for (const value in package) {
      const column = value;
      const text = package[value];
      filter(column, text, "expense");
    }
    deleteButton("expense");
  }

  amount.value = "";
  amountDescription.value = "";
});

function packageCreator(buttonValue) {
  checkForEmptyValues();
  const quantity = amount.value;
  const type = buttonValue;
  const description = amountDescription.value;
  const date = new Date().toLocaleDateString("en-GB");
  const package = { amount: quantity, type, description, date };
  console.log(package);
  return package;
}

async function sendBudget(package) {
  try {
    const res = await fetch("http://localhost:3000/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(package),
    });
  } catch (err) {
    console.log("Error at POST index.js");
    console.log(err);
  }
}

async function getBudget() {
  try {
    const res = await fetch("http://localhost:3000/budget", {
      method: "GET",
    });
    const json = await res.json();
    budgetLine(json.message);
  } catch (err) {
    console.log("Error at GET index.js");
    console.log(err);
  }
}

function filter(column, text, type) {
  if (column !== "id" && column !== "type") {
    if (text === null || text === "") {
      text = "---";
    }
    if (column === "amount") {
      quantity = text;
    }
    newElement(column, text, type);
  }
}

function budgetLine(element) {
  for (const value of element) {
    for (const data in value) {
      let column = data;
      let text = value[data];
      let type = value.type;

      filter(column, text, type);
    }
    deleteButton(value.type);
    updateBalance(value.amount, value.type);
  }

  const newBalance = document.getElementById("balance");
  newBalance.innerHTML = "BALANCE: $" + balance.toLocaleString("en-US");
}

function newElement(column, text, type) {
  const tagElement = document.createElement("div");
  tagElement.setAttribute("class", type);
  if (column === "amount") {
    tagElement.innerHTML = "$" + text.toLocaleString("en-US");
  } else {
    tagElement.innerHTML = text;
  }

  const motherElement = document.getElementById(column);
  motherElement.appendChild(tagElement);
}

function updateBalance(quantity, type) {
  if (type === "income") {
    balance = balance + quantity;
  } else if (type === "expense") {
    balance = balance - quantity;
  }
}

function checkForEmptyValues() {
  if (amount.value === "") {
    amount.value = 0;
  }
}

function deleteButton(type) {
  const dummyDiv = document.createElement("div");
  const deleteButton = document.createElement("div");
  deleteButton.setAttribute("class", `fa-solid fa-eraser ${type} icon`);

  const deleteColumn = document.getElementById("delete-column");
  dummyDiv.appendChild(deleteButton);
  deleteColumn.appendChild(dummyDiv);
}

//  "getNews", "fetchNews", "displayNews" are in charge of using a third part API to get
//  news from Apple, Microsoft, Amazon, Google and Meta. "fetchNews" and "getNews" were
//  separeted just to have a more cleaner code.
function getNews() {
  const bigTechCompanies = ["AAPL", "MSFT", "AMZN", "GOOG", "META"];
  let newsTechCompanies = [];

  bigTechCompanies.forEach(async (stock) => {
    const news = await fetchNews(stock);
    console.log(news);
    displayNews(news);
  });
}

async function fetchNews(stock) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "7bbc342697msha467c76105dd097p1d4764jsnae0564169317",
      "X-RapidAPI-Host": "real-time-finance-data.p.rapidapi.com",
    },
  };

  const responseNews = await fetch(
    `https://real-time-finance-data.p.rapidapi.com/stock-news?symbol=${stock}`,
    options
  );
  const jsonResponse = await responseNews.json();
  return jsonResponse;
}

function displayNews(stockNews) {
  const link = document.createElement("a");
  link.setAttribute("href", stockNews.data.news[0].article_url);
  link.setAttribute("class", "news-link");
  link.innerHTML = stockNews.data.news[0].article_title;

  const article = document.createElement("article");
  article.setAttribute("class", "news-article");
  article.appendChild(link);

  newsFooter.appendChild(article);
}

// getNews();
getBudget();
