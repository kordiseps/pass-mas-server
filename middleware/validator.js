const { body, validationResult } = require("express-validator");
const userRequestRules = () => {
  return [body("userMail").isEmail(), body("pinHash").isLength({ min: 5 })];
};

const dataRequestRules = () => {
  return [
    body("app").isLength({ min: 3 }),
    body("username").isLength({ min: 5 }),
    body("password").isLength({ min: 4 }),
  ];
};
const validateRequest = (req, res, next) => {
  console.log("validateRequest ok")
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userRequestRules,
  dataRequestRules,
  validateRequest,
};
