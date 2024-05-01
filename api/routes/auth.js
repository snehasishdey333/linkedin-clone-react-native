const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CustomError } = require("../middlewares/error");
const User = require("../models/User");

router.post("/register", async (req, res, next) => {
  
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw new CustomError("Username or email already exists!", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hashedPassword });
    const savedUser = await newUser.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.status(201).json(token)
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      throw new CustomError("Wrong Credentials!", 401);
    }

    const { password, ...data } = user._doc;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.status(200).json(token)
  } catch (error) {
    next(error);
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .json("user logged out successfully!");
  } catch (error) {
    next(error);
  }
});

router.get("/profile/:userId", async (req, res, next) => {
  
  const userId=req.params.userId
    try {
      const user = await User.findById(userId).populate("skills","title").populate("posts","caption image createdAt");
    if (!user) {
      throw new CustomError(404,"User not found!")
    }
    
    

    res.status(200).json( user );
    } catch (error) {
      next(error);
    }
  });


module.exports = router;
