const { body, validationResult } = require("express-validator");
const userRules = () => {
  return [body("userMail").isEmail(), body("pinCode").isNumeric(), body("pinCode").isLength({ min: 5 })];
};
const userChangePasswordRules = () => {
  return [body("pinCode").isNumeric(), body("pinCode").isLength({ min: 5 })];
};

const dataRules = () => {
  return [
    body("app").isLength({ min: 3 }),
    body("username").isLength({ min: 5 }),
    body("password").isLength({ min: 4 }),
    body("color").isLength({ min: 2 }),
  ];
};
const validateRequest = (req, res, next) => {
  console.log("validateRequest");
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    isSuccess:false,
    errors: extractedErrors,
  });
};

module.exports = {
  userRules,
  dataRules,
  validateRequest,
  userChangePasswordRules
};
