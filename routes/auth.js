const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = "AmeenHeroKhan";

const router = express.Router();

//ROUTE2: create user using: POST: 'api/auth/createUser'
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 charecters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // return error if not empty
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // make function async and await
    try {
      //check whether the user with email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json("Sorry email already exists");
      }
      //hashing the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //crete user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      //adding jwt
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET); // sync signed method

      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("User some error occured");
      //put in logger and sqs
    }
  }
);

//ROUTE 1: authenticate user using: POST: 'api/auth/login'
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // if empty show error
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Please try login with correct credentials" });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }
      //comparing the passwords
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try login with correct credentials" });
      }
      // jwt
      const data = {
        user: {
          id: user.id,
        },
      };
      let authToken = jwt.sign(data, JWT_SECRET);
      res.json(authToken);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("User some error occured");
    }
  }
);

//ROUTE 1: get login user using: GET: 'api/auth/getuser'

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("User some error occured");
  }
});

module.exports = router;
