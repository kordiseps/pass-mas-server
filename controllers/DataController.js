const express = require("express");
const router = express.Router();
const Data = require("../models/Data");
const checkAuth = require("../middleware/checkauth");

const { dataRules, validateRequest } = require("../middleware/validator");

router.use(checkAuth);

router.post(
  "/",
  dataRules(),
  validateRequest,
  dataMustNotExist,
  async (req, res) => {
    console.log("data/post",req.User._id);
    const data = new Data({
      userId: req.User._id,
      app: req.body.app,
      username: req.body.username,
      password: req.body.password,
      color: req.body.color,
    });
    const savedData = await data.save();
    res.status(200).send({
      isSuccess: true,
      message: savedData._id,
    });
  }
);
router.get("/", async (req, res) => {
  console.log("data/get",req.User._id);
  const savedDatas = await Data.find({
    userId: req.User._id
  });
  res.status(200).send({
    isSuccess: true,
    data:savedDatas
  });
});
router.get("/:id", dataMustExist, async (req, res) => {
  console.log("data/get/:id",req.User._id);
  res.status(200).send({
    isSuccess: true,
    data: req.Data,
  });
});
router.patch(
  "/:id",
  dataRules(),
  validateRequest,
  dataMustExist,
  async (req, res) => {
    console.log("data/patch/:id",req.User._id);
    const query = { _id: req.Data._id };
    const updateResult = await Data.updateOne(query, {
      $set: {
        app: req.body.app,
        username: req.body.username,
        password: req.body.password,
        color: req.body.color,
        updatedAt: new Date(),
      },
    });
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

router.delete("/:id", dataMustExist, async (req, res) => {
  console.log("data/delete/:id",req.User._id);
  const query = { _id: req.Data._id };
  var deleteResult = await Data.deleteOne(query);
  if (deleteResult.ok === 1) {
    res.status(200).send({
      isSuccess: true,
    });
  } else {
    return res.status(400).json({
      isSuccess: false,
      errors: "Could not remove",
    });
  }
});

async function dataMustExist(req, res, next) {
  const existingData = await Data.findOne({
    _id: req.params.id,
  }).exec();
  if (existingData === null) {
    return res.status(400).json({
      isSuccess: false,
      errors: "Data does not exist.",
    });
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
    return res.status(400).json({
      isSuccess: false,
      errors: "Data exists.",
    });
  } else {
    next();
  }
}

module.exports = router;
