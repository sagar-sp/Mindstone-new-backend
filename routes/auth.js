const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Sagarisagoodb$oy";

//Route 1: create a user using :Post "/api/auth/createUser" . No Login Require
router.post(
  "/createUser",
  [
    body("firstName", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter a Valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //If there are errors return the bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Check Wheather the user with this email exists already
    try {
      let user = await User.findOne({
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
      });
      if (user) {
        return res.status(400).json({
          error: "Sorry a user with this credential already exists",
          success: false,
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //create a new user
      user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: secPass,
        mobileNumber: req.body.mobileNumber,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken, success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Internal Server Error",
        success: false,
      });
    }
  }
);

//Route 2 : Authentication a User Using : POST "/api/auth/login" . No login required
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password Cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          error: "Please Try to login with correct credentials",
          success: false,
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please Enter Correct Password", success: false });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken, success: true });
    } catch (error) {
      res.status(500).send("Internal Server Error Occurred");
    }
  }
);

//Route 3 : Get loggedIn user Details Using : POST "/api/auth/login" . No login requied
router.post("/getUser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error Occurred");
  }
});

module.exports = router;
