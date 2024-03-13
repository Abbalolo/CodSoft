const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    const saveUser = await newUser.save();
    res.status(200).json(saveUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Check if password matches
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json("Incorrect password");
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "3d",
    });

    // Remove password from user info
    const { password: userPassword, ...userInfo } = user._doc;

    // Set token as cookie and send user info
    res
      .cookie("token", token, { sameSite: "none", secure: true })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json("Internal server error");
  }
});

router.get("/logout", async (req, res) => {
  try {
    // Clear token cookie and send logout message
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .send("User logged out successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
