const Joi = require("joi");
const jwt = require("jsonwebtoken");


module.exports.checkUser = async (request, response, next) => {
  if (request.headers.authorization === undefined) {
    response.status(403).json({
      status: false,
      message: "you are not allow to access this pages",
    });
    return false;
  }
  let token = request.headers.authorization.split(" ")[1];
  if (token === undefined) {
    if (token === undefined) {
      response.status(403).json({
        status: false,
        message: "you are not allow to access this pages",
      });
      return false;
    }
  }
  try {
   let user =  await jwt.verify(token, process.env.SECRET_KEY);
    response.user = {...user};
    next();
  } catch (error) {
    response.status(401).send({
      status: false,
      message: error.message,
    });
    return false;
  }
};

async function validate(data, schema, response, next) {
  try {
    await schema.validateAsync({ ...data });
    next();
  } catch (error) {
    response.json({ status: false, message: error.details[0].message });
    return false;
  }
}

module.exports.loginValidation = async (request, response, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
  });
  validate(request.body, schema, response, next);
};
