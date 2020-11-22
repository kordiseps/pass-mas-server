const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/checkauth");
const { userRules, validateRequest } = require("../middleware/validator");

router.get("/login", userRules(), validateRequest, async (req, res) => {
  const existingUser = await User.findOne({
    userMail: req.body.userMail,
    pinCode: req.body.pinCode,
  }).exec();
  if (existingUser === null) {
    return res.status(404).json({ errors: "User does not exist." });
  } else {
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    res.status(200).send({ message: "success", token: token });
  }
});

router.post("/register", userRules(), validateRequest, async (req, res) => {
  const existingUser = await User.findOne({
    userMail: req.body.userMail,
  }).exec();
  if (existingUser !== null) {
    return res.status(403).json({ errors: "User exists." });
  } else {
    const user = new User({
      userMail: req.body.userMail,
      pinCode: req.body.pinCode,
    });
    const savedUser = await user.save();
    res.status(200).send(savedUser);
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
      res.status(200).send({ message: "success" });
    } else {
      return res.status(400).json({ errors: "Couldn't change" });
    }
  }
);

module.exports = router;
