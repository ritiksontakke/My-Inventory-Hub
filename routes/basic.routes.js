const BasicController = require("../controller/basic.controller");

const BasicRouter = require("express").Router();

BasicRouter.get('/',BasicController.homePage);
BasicRouter.get('/login',BasicController.loginPage);
BasicRouter.get('/new_registration',BasicController.registrationPage);

BasicRouter.post('/save-user',BasicController.saveUser)


module.exports = BasicRouter;

