const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = async (req, res, next) => {
  try {
    const token = req.header("auth-key");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const existingUser = await User.findOne({
      _id: decodedToken._id,
    }).exec();
    if (existingUser === null) {
      res.status(402).send({
        message: "Auth failed",
      });
    } else {
      req.User = existingUser;
    }    
    next();
  } catch (error) {
    res.status(401).send({
      message: "Auth failed",
    });
  }
};
