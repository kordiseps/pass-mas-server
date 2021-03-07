const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/checkauth");
const { userRules, validateRequest } = require("../middleware/validator");

router.post("/login", userRules(), validateRequest, async (req, res) => {
  const existingUser = await User.findOne({
    userMail: req.body.userMail,
    pinCode: req.body.pinCode,
  }).exec();
  if (existingUser === null) {
    return res.status(404).json({
      isSuccess: false,
      errors: "User does not exist.",
    });
  } else {
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    res.status(200).send({
      isSuccess: true,
      token: token,
    });
  }
});

router.post("/register", userRules(), validateRequest, async (req, res) => {
  const existingUser = await User.findOne({
    userMail: req.body.userMail,
  }).exec();
  if (existingUser !== null) {
    return res.status(403).json({
      isSuccess: false,
      errors: "User exists.",
    });
  } else {
    const user = new User({
      userMail: req.body.userMail,
      pinCode: req.body.pinCode,
    });
    const savedUser = await user.save();
    res.status(200).send({
      isSuccess: true,
    });
  }
});

router.post(
  "/changePassword",
  userRules(),
  validateRequest,
  checkAuth,
  async (req, res) => {
    const updateResult = await User.updateOne(
      { _id: req.User._id },
      { $set: { pinCode: req.body.pinCode, updatedAt: new Date() } }
    );
    if (updateResult.ok === 1) {
      res.status(200).send({
        isSuccess: true,
      });
    } else {
      return res.status(400).json({
        isSuccess: false,
        errors: "Couldn't change",
      });
    }
  }
);

router.post("/removeAccount", checkAuth, async (req, res) => {
  const Data = require("../models/Data");
  //send e mail datas to user mail address(username)
  const userId = req.User._id;
  const query = { userId: userId };
  const dataDeleteResult = await Data.deleteMany(query);
  if (dataDeleteResult.ok !== 1) {
    return res.status(400).json({
      isSuccess: false,
      errors: "Couldn't remove data",
    });
  }
  const userDeleteResult = await User.deleteOne({ _id: userId });
  if (userDeleteResult.ok !== 1) {
    return res.status(400).json({
      isSuccess: false,
      errors: "Data removed. User couldn't remove.",
    });
  } else {
    res.status(200).send({
      isSuccess: true,
    });
  }
});

module.exports = router;
