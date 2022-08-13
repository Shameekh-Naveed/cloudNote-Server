const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchuser");
const User = require("../models/User");
const Notes = require("../models/Notes");
const { ResultWithContext } = require("express-validator/src/chain");
const { request } = require("express");

// Fetching all notes for a user using GET "/api/notes/fetchNotes". Login required
router.get("/fetchNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});
// Adding a new note for a user using GET "/api/notes/addNote". Login required
router.post(
  "/addNote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Minimum length is 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // Error Handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tags } = req.body;
      const note = new Notes({
        title,
        description,
        tags,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

// Updating an existing for a user using GET "/api/notes/updateNote". Login required
router.put("/updateNote/:id", fetchUser, async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tags) newNote.tags = tags;

    // Find the not
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");
    // Does user have access to this note
    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Access Denied");
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});
// Delete an existing for a user using DELETE "/api/notes/deleteNote". Login required
router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
  try {
    // Find the note to be deleted
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");
    // Does user have access to this note
    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Access Denied");

    note = await Notes.findByIdAndDelete(req.params.id);

    res.json({ message: "Success note has been deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});

module.exports = router;
