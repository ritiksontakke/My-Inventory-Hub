require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const BasicRouter = require("./routes/basic.routes");
var session = require("express-session");
let morgan = require("morgan");
const app = express();
app.use(morgan("tiny"));
app.use(
  session({
    secret: "3riTech",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.static("public"));

//set view
app.set("views", "./views");
app.set("view engine", "pug");

// enable post/put data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", BasicRouter);

mongoose
  .connect(process.env.URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("db connected successfully");
      console.log("server is running on port", process.env.PORT);
    });
  })
  .catch(() => {
    process.exit(1);
  });
