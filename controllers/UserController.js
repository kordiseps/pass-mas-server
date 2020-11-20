const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const checkAuth = require('../middleware/checkauth');
const { userRequestRules, validateRequest } = require("../middleware/validator");

router.get(
  "/login",
  userRequestRules(),
  validateRequest,
  findUser,
  userMustExist,
  async (req, res) => {
    console.log("user/get/login")
    try {
      const token = jwt.sign({ _id: req.User._id }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });
      res.status(200).send({ message: "success", token: token });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

router.post(
  "/register",
  userRequestRules(),
  validateRequest,
  findUser,
  userMustNotExist,
  async (req, res) => {
    console.log("user/post/register")
    const user = new User({
      userMail: req.body.userMail,
      pinHash: req.body.pinHash,
    });
    const savedUser = await user.save();
    res.status(200).send(savedUser);
  }
);

router.post(
  "/changePassword",
  userRequestRules(),
  validateRequest,
  checkAuth,
  async (req, res) => {
    console.log("user/post/changePassword")
    const updateResult = await User.updateOne(
      { _id: req.User._id },
      { $set: { pinHash: req.body.pinHash, updatedAt: new Date() } }
    );
    if (updateResult.nModified > 0) {
      res.status(200).send({message:"success"});
    } else {
      return res.status(400).json({ errors: "Couldn't change" });
    }
  }
);

async function findUser(req, res, next) {
  const existingUser = await User.findOne({
    userMail: req.body.userMail,
  }).exec();
  if (existingUser === null) {
    req.UserExists = false;
  } else {
    req.UserExists = true;
    req.User = existingUser;
  }
  next();
}
async function userMustExist(req, res, next) {
  if (req.UserExists === false) {
    return res.status(400).json({ errors: "User doesnt exists." });
  }
  next();
}
async function userMustNotExist(req, res, next) {
  if (req.UserExists === true) {
    return res.status(400).json({ errors: "User exist." });
  }
  next();
}

module.exports = router;
