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

const eraser = document.getElementsByClassName("fa-eraser");

let lastId = 0;

//  "addButton" and "minusButton" are meant to differentiate if the POST request is going to
//  be for and income or espense. Both function do the same after that.

//  Both will have a "package" that is just a variable that handles all the information necessary
//  to put in the body of the POST. Then it will restart the balance. If I don't restart it the
//  balance will add the new balance to the old balance when I call "getBudget".

//  "sendBudget" is used by both to do the POST. I have to pass the "package" as the parameter.
//  After sending it I want to update my list. I need to erase all of the elements, if not I will
//  have a duplicate of them. Then I call "getBudget" to get the new list updated and finally I
//  reset the inputs.
addButton.addEventListener("click", async (e) => {
  const package = packageCreator("income");
  balance = 0;
  if (package.amount > 0) {
    await sendBudget(package);
    removeAllChild();
    await getBudget();
  }
  amount.value = "";
  amountDescription.value = "";
});

minusButton.addEventListener("click", async (e) => {
  const package = packageCreator("expense");
  balance = 0;
  if (package.amount > 0) {
    await sendBudget(package);
    removeAllChild();
    await getBudget();
  }

  amount.value = "";
  amountDescription.value = "";
});

//  packageCreater() when called it will grab the values that are in the input boxes. Recieve
//  the type of the button to specify if it will add or rest to the balance. Automatically get
//  and finally create an object with all the information just to be send in the POST request.
function packageCreator(buttonType) {
  checkForEmptyValues();
  const quantity = amount.value;
  const type = buttonType;
  const description = amountDescription.value;
  const date = new Date().toLocaleDateString("en-GB");
  const package = { amount: quantity, type, description, date };
  return package;
}

//  checkForEmptyValues() will transform the empty value from the input box to cero.
function checkForEmptyValues() {
  if (amount.value === "") {
    amount.value = 0;
  }
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
    const json = await res.json();
    console.log(json);
  } catch (err) {
    console.log("Error at POST index.js");
    console.log(err);
  }
}

//  getBudget() will make a GET request to the database, then pass the data to budgetLine().
async function getBudget() {
  try {
    const res = await fetch("http://localhost:3000/budget", {
      method: "GET",
    });
    const json = await res.json();
    console.log(json);
    budgetLine(json.message);
  } catch (err) {
    console.log("Error at GET index.js");
    console.log(err);
  }
}

//  budgetLine() looks confusing, but it the idea is to pass through each value of the data.
//  The data comes in an array but the values inside are objects. [{}, {}, {}, ... ]. The fist
//  for() is to pass through each value of the array. The second for() is to pass through each
//  value of the object.

//  After finishing passing though the values inside the object I need to create a delete button
//  and update the balance of the budget.
function budgetLine(element) {
  for (const value of element) {
    for (const data in value) {
      let column = data;
      let text = value[data];
      let type = value.type;
      let id = value.id;
      filter(column, text, type, id);
    }
    lastId = value.id;
    deleteButton(value.type, value.id);
    updateBalance(value.amount, value.type);
  }

  const newBalance = document.getElementById("balance");
  newBalance.innerHTML = "BALANCE: $" + balance.toLocaleString("en-US");
}

//  filter() is needed because not all of the values from the object have to be display. Id and
//  Type are used just for details inside the code but don't need to be shown explicitly.
//  What filter is doing is ignoring the values from Id and Type when the their information is
//  send. Then if the Description come blank is changing the value to "---". The final line is
//  to call newElement(). Which will create an element in the correct column.
function filter(column, text, type, id) {
  if (column !== "id" && column !== "type") {
    if (text === null || text === "") {
      text = "---";
    }
    newElement(column, text, type, id);
  }
}

//  newElement() creates the tags, adds the values where they correspond, set the attributes that
//  will make the element identifyable, get its CSS and data-set that will be used in the delete
//  function to make everything more easy.

//  The only element that will have an extra data-set will be the Amount to make the amount easier
//  to use/reach in the delete function to update the balance.
function newElement(column, text, type, id) {
  const tagElement = document.createElement("div");
  tagElement.setAttribute("class", `${type} ${id}`);
  tagElement.setAttribute("data-id", id);
  tagElement.setAttribute("data-type", type);
  if (column === "amount") {
    tagElement.innerHTML = "$" + text.toLocaleString("en-US");
    tagElement.setAttribute("data-amount", text);
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

//  deleteButton() it has the same idea has newElement() but it had to be separated because the only
//  thing that it need is the Type(expense/income) and it has to be called after the second for()
//  finishes. It also has the eventListener inside to add the functionality of the delete functions.
function deleteButton(type, id) {
  const dummyDiv = document.createElement("div");
  const deleteButton = document.createElement("div");
  deleteButton.setAttribute("class", `fa-solid fa-eraser ${type} icon ${id}`);
  deleteButton.setAttribute("data-id", id);

  deleteButton.addEventListener("click", (e) => {
    deleteLine(e.target.dataset.id);
  });

  const deleteColumn = document.getElementById("delete-column");
  deleteColumn.appendChild(deleteButton);
}

//  "getNews", "fetchNews", "displayNews" are in charge of using a third part API to get
//  news from Apple, Microsoft, Amazon, Google and Meta. "fetchNews" and "getNews" were
//  separeted just to have a more cleaner code.
function getNews() {
  const bigTechCompanies = ["AAPL", "MSFT", "AMZN", "GOOG", "META"];

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

//  This two functions are in charge of getting all the information before erasing a budget
//  line. Updating the balance and making the DELETE request,
function deleteLine(id) {
  const line = document.getElementsByClassName(id);
  const arrayLine = Array.from(line);

  const quantity = parseInt(arrayLine[0].dataset.amount);
  let type = "";
  if (arrayLine[0].dataset.type === "income") {
    type = "expense";
  } else if (arrayLine[0].dataset.type === "expense") {
    type = "income";
  }

  updateBalance(quantity, type);
  newBalance.innerHTML = "BALANCE: $" + balance.toLocaleString("en-US");
  fetchDelete(id);
  arrayLine.forEach((x) => x.remove());
}

async function fetchDelete(id) {
  try {
    const resDelete = await fetch(`http://localhost:3000/budget/${id}`, {
      method: "DELETE",
    });
    const jsonResDelete = await resDelete.json();
    console.log(jsonResDelete);
  } catch (err) {
    console.log("Error at index.js");
    console.log(err);
  }
}

function removeAllChild() {
  const incomeElement = Array.from(document.getElementsByClassName("income"));
  const expenseElement = Array.from(document.getElementsByClassName("expense"));

  incomeElement.forEach((income) => income.remove());
  expenseElement.forEach((expense) => expense.remove());
}

// getNews();
getBudget();

// In case you need to add/res the values off line. Comment or delete code in addButton/deletebutton
// and paste this inside.

// lastId = lastId + 1;
// const package = packageCreator("income");
// balance = balance + parseInt(amount.value);
// newBalance.innerHTML = "BALANCE: $" + balance.toLocaleString("en-US");
// if (package.amount > 0) {
//   sendBudget(package);
//   for (const value in package) {
//     const column = value;
//     const text = package[value];
//     filter(column, text, "income", lastId);
//   }
//   deleteButton("income", lastId);
// }
// amount.value = "";
// amountDescription.value = "";
