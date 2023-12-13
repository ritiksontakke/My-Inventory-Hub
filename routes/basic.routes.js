const multer = require("multer");
const upload = multer(); //add multipart from data
const BasicController = require("../controller/basic.controller");

const BasicRouter = require("express").Router();

BasicRouter.get("/", BasicController.homePage);
BasicRouter.get("/login", BasicController.loginPage);
BasicRouter.get("/new_registration", BasicController.registrationPage);
BasicRouter.get("/remove-user", BasicController.removeUsers);
BasicRouter.get("/logout", BasicController.logout);

BasicRouter.post("/save-user", BasicController.saveUser);
BasicRouter.post("/user-login", BasicController.userLogin);

BasicRouter.get("/api/get-product", BasicController.getProduct);
BasicRouter.post(
  "/api/save-new-product",
  upload.none(),
  BasicController.saveProduct
);

module.exports = BasicRouter;
