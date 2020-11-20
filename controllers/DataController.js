const express = require("express");
const router = express.Router();
const Data = require("../models/Data");
const checkAuth = require("../middleware/checkauth");

const {
  dataRequestRules,
  validateRequest,
} = require("../middleware/validator");

router.use(checkAuth);

router.post(
  "/",
  dataRequestRules(),
  validateRequest,
  dataMustNotExist,
  async (req, res) => {
    console.log("data/post")
    const data = new Data({
      userId: req.User._id,
      app: req.body.app,
      username: req.body.username,
      password: req.body.password,
    });
    const savedData = await data.save();
    res.status(200).send({ message: savedData._id });
  }
);
router.get("/", async (req, res) => {
    console.log("data/get")
    const savedDatas = await Data.find();
  res.status(200).send(savedDatas);
});
router.get("/:id", dataMustExist, async (req, res) => {
    console.log("data/get/:id")
    res.status(200).send(req.Data);
});
router.patch(
  "/:id",
  dataRequestRules(),
  validateRequest,
  dataMustExist,
  async (req, res) => {
    console.log("data/patch/:id")
    const query = { _id: req.Data._id };
    const updateResult = await Data.updateOne(query, {
      $set: {
        app: req.body.app,
        username: req.body.username,
        password: req.body.password,
        updatedAt: new Date(),
      },
    });
    if (updateResult.ok === 1) {
      res.status(200).send({ message: "success" });
    } else {
      return res.status(400).json({ errors: "Couldn't change" });
    }
  }
);
router.delete("/:id", dataMustExist, async (req, res) => {
    console.log("data/delete/:id")
    const query = { _id: req.Data._id };
  var deleteResult = await Data.deleteOne(query);
  if (deleteResult.ok === 1) {
    res.status(200).send({ message: "success" });
  } else {
    return res.status(400).json({ errors: "Couldn't remove" });
  }
});

async function dataMustExist(req, res, next) {
  const existingData = await Data.findOne({
    _id: req.params.id,
  }).exec();
  if (existingData === null) {
    return res.status(400).json({ errors: "Data doesnt exist." });
  } else {
    req.Data = existingData;
  }
  next();
}

async function dataMustNotExist(req, res, next) {
  const existingData = await Data.findOne({
    userId: req.User._id,
    app: req.body.app,
    username: req.body.username,
  }).exec();

  if (existingData !== null) {
    return res.status(400).json({ errors: "Data exists." });
  } else {
    next();
  }
}

module.exports = router;
