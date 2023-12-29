const UserModel = require("../model/user.model");
const ProductModel = require("../model/product.model");

const BasicController = {
  homePage(request, response) {
    if (request.session.login === undefined) {
      response.redirect("/login");
      return false;
    }
    response.render("dashboard", {
      login: request.session.login,
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

  async apiUserLogin(request, response) {
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
        response.json({ status: true, token: "jwt" });
      } else {
        request.json({
          status: false,
          message: "Username or password is wrong, try again",
        });
      }
    } catch (error) {
      response.json({
        status: false,
        message: "Something went wrong, try again",
      });
    }
  },
  async saveProduct(request, response) {
    try {
      let { productName, qty, price, mangDate, id } = request.body;
      let newProduct = ProductModel({
        productName,
        qty,
        price,
        mangDate,
        id,
        image: request.file.filename,
      });
      let result = await newProduct.save();
      if (result) {
        response.json({
          status: true,
          message: "product saved ",
        });
      } else {
        response.json({
          status: false,
          message: "unable to saved product try again",
        });
      }
    } catch (error) {
      response.json({ status: false, message: "server error try again" });
    }
  },
  async getProduct(request, response) {
    try {
      if (request.session.login !== undefined) {
        let result = await ProductModel.find({
          id: request.session.login.user._id,
        });
        response.json({ status: true, result });
      } else {
        response.status(401).json({
          status: false,
          message: "Session is expire re-login again",
        });
      }
    } catch (error) {
      response.json({ status: false, message: "server error try again" });
    }
  },

  async removeProduct(request, response) {
    let { id } = request.params;
    try {
      await ProductModel.findByIdAndDelete(id);
      response.json({ status: true, message: "product removed successfully" });
    } catch (error) {
      response.json({ status: false, message: "server error try again" });
    }
  },
};

module.exports = BasicController;
