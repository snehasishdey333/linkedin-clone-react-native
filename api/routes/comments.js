const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { CustomError } = require("../middlewares/error");

router.post("/create", async (req, res, next) => {
  
  const { postId, userId, text } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new CustomError("Post not found", 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const newComment = new Comment({
      user: userId,
      post: postId,
      text,
    })

    await newComment.save();
    await newComment.populate(
      "user",
      "name bio profilePicture"
    );
    post.comments.push(newComment._id);
    await post.save();

    res
      .status(201)
      .json({ message: "Comment added to the post", comment: newComment });
  } catch (error) {
    next(error);
  }
});

router.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new CustomError("Post not found!", 404);
    }

    const comments = await Comment.find({ post: postId }).populate(
      "user",
      "name bio profilePicture"
    );

    res.status(200).json( comments );
  } catch (error) {
    next(error);
  }
});

router.delete("/:commentId", async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new CustomError("Comment not found!", 404);
    }

    await Post.findOneAndUpdate(
      { comments: commentId },
      { $pull: { comments: commentId } },
      { new: true }
    );

    await comment.deleteOne();
    res.status(200).json({ message: "Comment has been deleted!" });
  } catch (error) {
    next(error);
  }
});

router.post("/like/:commentId/:userId", async (req, res, next) => {
  const { commentId, userId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new CustomError("Comment not found!", 404);
    }

    if (comment.likes.includes(userId)) {
      throw new CustomError("You have already liked this comment", 400);
    }

    comment.likes.push(userId);
    await comment.save();

    res.status(200).json({ message: "Comment liked successfully!", comment });
  } catch (error) {
    next(error);
  }
});

router.post("/dislike/:commentId/:userId", async (req, res, next) => {
  const { commentId, userId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new CustomError("Comment not found!", 404);
    }

    if (!comment.likes.includes(userId)) {
      throw new CustomError("You have have not liked this comment", 400);
    }

    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    await comment.save();

    res
      .status(200)
      .json({ message: "Comment disliked successfully!", comment });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
