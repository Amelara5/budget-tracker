const express = require("express");
const server = require("./utils/server");
const path = require("path");
const app = express();

// const app = server();
server(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/index.html"));
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});
