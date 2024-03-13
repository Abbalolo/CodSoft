const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");

router.post("/create", verifyToken, async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
      }
    );
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Comment.deleteByIdAndDelete({ userId: req.params.id });
    res.status(200).json({ message: "Comments have been deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get("/post/:postId", async (req, res) => {
  try {
    const Comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(Comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
