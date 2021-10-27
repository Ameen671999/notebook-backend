const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');

const router = express.Router();

//create user using: POST: 'api/auth/createUser'
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
    const secPass = await bcrypt.hash(req.body.password, salt)
    //crete user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    res.send({ user });
  } catch(error) {
    console.log(error.message)
    res.status(500).send ('User some error occured')
    //put in logger and sqs
  }
  }
);

module.exports = router;
