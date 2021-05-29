const express = require("express");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const app = express();

// app.use(express.urlencoded()); // x-www-form-urlencoded <form>

app.use(express.json()); // application/json

app.use((req, res, next) => {
  // Set the headers for all responses to avoid CORS error on client side
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// GET /feed/posts
app.use("/feed", feedRoutes);

mongoose
  .connect(
    "mongodb+srv://kostis:kostis@cluster0.xomaa.mongodb.net/messages?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
