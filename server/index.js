const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
var cors = require("cors");

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);
// JSONを扱える様にする
app.use(express.json());
app.use("/api/v1", require("./src/v1/routes"));

// DB接続
try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log("DB接続中...");
} catch (error) {
  console.log(error);
}

// app.get("/", (req, res) => {
//   res.send("wow!");
// });

// 起動
app.listen(PORT, () => {
  console.log("Server起動中...");
});
