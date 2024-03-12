const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hashSync(password,salt)
        const newUser = new User({ username, email, password:hashedPassword });
        const saveUser = await newUser.save();
        res.status(200).json(saveUser)
    } catch (err) {
        res.status(500).json(err)
    }
})
// router.post("/login", async (req, res) => {
//     try {
//         const user = await User.findOne({ email: req.body.email, username: req.body.username })
//         if (!user) {
//             return res.status(404).json("user not found")
//         }
//         const match = await bcrypt.compare(req.body.password,user.password)
//         if (!match) {
//             return  res.status(401).json("user password not match");
//         }
//         res.status(200).json(user)
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })

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
      
      const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "3d" })
        const {paassword, ...info} = user._doc
      res.cookie("token", token).status(200).json(info)

    res.status(200).json(user);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json("Internal server error");
  }
});

router.get("/logout", async (req, res) => {
    try {
    res.clearCookie("token", {sameSite: "none", secure: true}).status(200).send("User logged out successfull")
    } catch (err) {
        res.status(500).json(err)
}
})

module.exports = router