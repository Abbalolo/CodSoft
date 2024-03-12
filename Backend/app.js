
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;
const authRouter = require("./routers/auth");
const userRouter = require("./routers/users");
require("dotenv").config();

app.use(cors());
app.options("*", cors());

const api = process.env.API_URL;

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.error(err);
  }
};

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(express.json())

// Middleware for logging HTTP requests
app.use(morgan("tiny"));

// Routes
app.use(`${api}/auth`, authRouter);
app.use(`${api}/users`, userRouter);

// Start the server
app.listen(port, () => {
  connectDb();
  console.log("Server has started");
});
