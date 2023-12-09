const UserModel = require("../model/user.model");

const BasicController = {
  homePage(request, response) {
    response.render("dashboard");
  },
  loginPage(request, response) {
    response.render("login");
  },

  registrationPage(request, response) {
    let message =
      request.session.message !== undefined ? request.session.message : "";
    delete request.session.message;
    response.render("new_registration", {
      message: message,
    });
  },

  async saveUser(request, response) {
    let data = request.body;
    try {
      let newUser = UserModel({
        name: data.fullName,
        password: data.password,
        mobile: data.mobile,
        email: data.email,
      });

      UserModel.find({email:{$regex:"^"+email+"$", Option:"i"}})


      let result = await newUser.save();
      if (result) {
        request.session.message = "user Registration Done Successfully";
      } else {
        request.session.message = "Unable to save user, try again";
      }
      response.redirect("/new_registration");
    } catch (error) {
      request.session.message = "Unable to save user, try again";
      response.redirect("/new_registration");
    }
  },
};

module.exports = BasicController;
