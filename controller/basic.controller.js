const UserModel = require("../model/user.model");

const BasicController = {
  homePage(request, response) {
    if (request.session.login === undefined) {
      response.redirect("/login");
      return false;
    }
    response.render("dashboard",{
      login:request.session.login,
    });
  },
  logout(request, response) {
    delete request.session.login;
    response.redirect("/login");
  },

  loginPage(request, response) {
    if (request.session.login !== undefined) {
      response.redirect("/");
      return false;
    }
    let message =
      request.session.message !== undefined ? request.session.message : "";
    delete request.session.message;
    response.render("login", {
      message: message,
    });
  },

  registrationPage(request, response) {
    if (request.session.login !== undefined) {
      response.redirect("/");
      return false;
    }
    let message =
      request.session.message !== undefined ? request.session.message : "";
    delete request.session.message;
    response.render("new_registration", {
      message: message,
      newUser: { ...request.session.newUser },
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

      let isUserExists = await UserModel.findOne({
        email: { $regex: "^" + data.email + "$", $options: "i" },
      });
      if (isUserExists) {
        request.session.message = "Email already taken, try another one";
        request.session.newUser = { ...data };
        response.redirect("/new_registration");
      } else {
        let result = await newUser.save();
        if (result) {
          request.session.message =
            "User Registration Done Successfully, login now";
          request.session.newUser = {};
          response.redirect("/login");
        } else {
          request.session.message = "Unable to save user, try again";
          request.session.newUser = { ...data };
          response.redirect("/new_registration");
        }
      }
    } catch (error) {
      request.session.message = "Unable to save user, try again";
      request.session.newUser = { ...data };
      response.redirect("/new_registration");
    }
  },

  async removeUsers(request, response) {
    let result = await UserModel.deleteMany({});
    response.json({
      status: true,
      result,
    });
  },

  async userLogin(request, response) {
    let data = request.body;
    try {
      let user = await UserModel.findOne(
        {
          email: { $regex: `^${data.email}$`, $options: "i" },
          password: data.password,
        },
        { password: 0 }
      );
      if (user) {
        request.session.login = { user };
        response.redirect("/");
      } else {
        request.session.message = "Username or password is wrong, try again";
        response.redirect("/login");
      }
    } catch (error) {
      request.session.message = "Something went wrong, try again";
      response.redirect("/login");
    }
  },
  async saveProduct(request, response){
    let data = request.body;
    response.json({status:true, data})
  }
};

module.exports = BasicController;
