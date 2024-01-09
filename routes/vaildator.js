const Joi = require("joi");

async function validate(data , schema, response, next) {
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
  validate(request.body , schema, response, next)
};

 