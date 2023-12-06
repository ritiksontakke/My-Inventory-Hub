const express = require("express");
const mongoose = require("mongoose");
const BasicRouter = require("./routes/basic.routes");
var session = require("express-session");
const PORT = 3031;
const URI = `mongodb://127.0.0.1:27017/product_mang`;
const app = express();

app.use(
  session({
    secret: "3riTech",
    resave: true,
    saveUninitialized: true,
  })
);

//set view
app.set("views", "./views");
app.set("view engine", "pug");

// enable post/put data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", BasicRouter);

mongoose
  .connect(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("db connected successfully");
      console.log("server is running on port", PORT);
    });
  })
  .catch(() => {
    process.exit(1);
  });
