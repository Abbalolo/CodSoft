const mongoose = require("mongoose"); // cloud database
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },

  userId: {
    type: String,
    required: true,
  },

  categorie: {
    type: Array,
  },


 
}, {timestamps: true});

exports.Post = mongoose.model("Post", PostSchema);
