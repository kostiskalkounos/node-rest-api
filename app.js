const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const authRoutes = require("./routes/auth");
const feedRoutes = require("./routes/feed");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(express.urlencoded()); // x-www-form-urlencoded <form>

app.use(express.json()); // application/json
app.use(
  multer({ storage: fileStorage, filefilter: fileFilter }).single("image") // extract a single file stored in an 'image' field in the inc req
);

// serve the images statically to view them on the client
app.use("/images", express.static(path.join(__dirname, "images")));

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
app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);

// error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  // this property exists by default and
  // holds the message we passed in the Error() constructor
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://kostis:kostis@cluster0.xomaa.mongodb.net/messages?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    const server = app.listen(8080);
    const io = require("./socket").init(server);
    // socket is the connection between the server and the client
    // it executes for every new client that connects
    io.on("connection", (socket) => {
      console.log("Client connected.");
    });
  })
  .catch((err) => {
    console.log(err);
  });
