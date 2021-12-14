const express = require("express");
const { model } = require("mongoose");
const multer = require("multer");
const app = express();
const mongoose = require("mongoose");
const User = require("./schema");
const { param } = require("express/lib/request");
const bodyParser = require("body-parser");
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/workshop11", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


mongoose.connection.on("connected", (connected) => {
  console.log("connection with database");
});



const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./image");
    },
    limits: {
      files: 1,
      fileSize: 1024 * 1024,
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "--" + Date.now() + ".jpg");
    },
    onFileUploadStart: function (file) {
      console.log("Inside uploads");
      if (
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png"
      ) {
        return true;
      } else {
        return false;
      }
    },
  }),
}).single("image");

app.post("/upload", upload, async (req, res) => {
  const user = new User({
    filename: req.file.filename,
    imagepath: req.file.path,
    imageextension: req.file.mimetype,
    imageSize: req.file.size,
  });

  let result = await user.save();
  console.log(req.file);
  res.send(result);
});

app.delete("/delete", async (req, res) => {
  let result = await User.deleteOne({ _id: req.body.id });
  res.status(201).json(result);
});

app.put("/rename/:id", async (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { filename: req.body.filename } }
  )
    .then((result) => {
      res.status(201).json({
        rename: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

app.listen(5000);
