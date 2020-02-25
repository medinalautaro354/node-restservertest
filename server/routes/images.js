const express = require("express");
const app = express();

const { validateTokenUrl } = require("../middlewares/authentication");

const fs = require("fs");
const path = require("path");

app.get("/images/:type/:image", validateTokenUrl, (req, res) => {
  let type = req.params.type;
  let image = req.params.image;

  let imagePath = path.resolve(__dirname, `../../uploads/${type}/${image}`);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    let defaultImagePath = path.resolve(__dirname, "../assets/default.jpg");
    res.sendFile(defaultImagePath);
  }
});

module.exports = app;
