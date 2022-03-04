const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const StratergyData = require("../../mindstonenew/src/constants/StratergyData");
const JWT_SECRET = "Sagarisagoodb$oy";
var jwt = require("jsonwebtoken");
const moment = require("moment");
router.get("/getStratergies", async (req, res) => {
  try {
    res.json({
      StratergyData,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/saveStratergy", async (req, res) => {
  try {
    let subscription = "";
    const { sname, count, rate, save, finalPrice } = req.body;
    if (!sname) {
      return res.status(400).json({
        error: "stratergy name is required",
        success: false,
      });
    }
    if (!count) {
      return res.status(400).json({
        error: "stratergy count is required",
        success: false,
      });
    }
    if (!rate) {
      return res.status(400).json({
        error: "stratergy name is required",
        success: false,
      });
    }
    if (!finalPrice) {
      return res.status(400).json({
        error: "stratergy finalPrice is required",
        success: false,
      });
    }
    if (!save) {
      return res.status(400).json({
        error: "stratergy save is required",
        success: false,
      });
    }
    let id = "";
    const token = req.headers["auth-token"];
    if (!token) {
      res
        .status(401)
        .send({ error: "Please Authenticate using a valid token" });
    }
    const data = jwt.verify(token, JWT_SECRET);
    id = data?.user?.id;
    subscription = await Subscription.create({
      user: id,
      sname: sname,
      count: count,
      rate: rate,
      Save: save,
      finalPrice: finalPrice,
      exp_date: moment().add(count, "months").format("Do MMMM YYYY"),
    });
    res.json({ page: "myplans", success: true, subscription });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "Bad Request" });
  }
});

module.exports = router;
