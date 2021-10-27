const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//ROUTE 1: get login user using: GET: 'api/auth/getuser'
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("User some error occured");
    //put in logger and sqs
  }
});

//ROUTE 2: add a new note using: OPOST: 'api/auth/addnote'
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    // return error if not empty
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      notes.save();
      res.json([notes]);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("User some error occured");
      //put in logger and sqs
    }
  }
);

module.exports = router;
