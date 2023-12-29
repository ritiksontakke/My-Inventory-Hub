const Joi = require("joi");

module.exports.loginValidation = async (request, response, next) => {
  const schema = Joi.object({
    email: Joi.required(),
    password: Joi.required(),
  });
  try {
    await schema.validateAsync();
    next();
  } catch (error) {
    response.json({ status: false, message: error });
    return false;
  }
};
