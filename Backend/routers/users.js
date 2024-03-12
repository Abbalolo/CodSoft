const express = require("express");
const router = express.Router();
const User = require("../models/user")
const bcrypt = require("bcrypt")


router.put("/:id", async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hashSync(req.body.password, salt);
        }

         const allowedFields = {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
         };
    
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { $set: allowedFields },
          { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err)
    }

})

// router.get("/user", async (req, res) => {
// const user = new User.
// })
// router.get("/user", async (req, res) => {
// const user = new User.
// })

module.exports = router