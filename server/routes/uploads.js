const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const {validateToken} = require('../middlewares/authentication');

const User = require("../models/user");
const Product = require("../models/product");

const fs = require("fs");
const path = require("path");

app.use(fileUpload());

app.put("/uploads/:type/:id", validateToken,(req, res) => {
  let type = req.params.type;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ningun archivo"
      }
    });
  }

  let validTypes = ["products", "users"];
  if (validTypes.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Los tipos permitidos son ${validTypes.join(", ")}`
      }
    });
  }

  let file = req.files.file;
  let nameFileShort = file.name.split(".");
  let extension = nameFileShort[nameFileShort.length - 1];

  let validExtensions = ["png", "jpg", "gif", "jpeg"];

  if (validExtensions.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Las extensiones permitidas son " + validExtensions.join(", ")
      }
    });
  }

  let nameFile = `${id}-${new Date().getTime()}.${extension}`;

  file.mv(`uploads/${type}/${nameFile}`, err => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });

    if (type === "users") {
      userImage(id, res, nameFile, type);
    } else {
      productImage(id, res, nameFile, type);
    }
  });
});

let userImage = (id, res, nameFile, type) => {
  User.findById(id, (err, entity) => {
    if (err) {
      deleteFile(nameFile, type);

      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!entity) {
      deleteFile(nameFile, type);

      return res.status(400).json({
        ok: false,
        err: {
          message: "No existe el usuario."
        }
      });
    }

    deleteFile(entity.image, type);

    entity.image = nameFile;
    entity.save((err, entitySaved) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.json({
        ok: true,
        user: entitySaved,
        image: nameFile
      });
    });
  });
};

let productImage = (id, res, nameFile, type) => {
  Product.findById(id, (err, entity) => {
    if (err) {
      deleteFile(nameFile, type);

      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!entity) {
      deleteFile(nameFile, type);

      return res.status(400).json({
        ok: false,
        err: {
          message: "No existe el usuario."
        }
      });
    }

    deleteFile(entity.image, type);

    entity.image = nameFile;
    entity.save((err, entitySaved) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.json({
        ok: true,
        user: entitySaved,
        image: nameFile
      });
    });
  });
};

let deleteFile = (nameFile, type) => {
  let imagePath = path.resolve(__dirname, `../../uploads/${type}/${nameFile}`);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

module.exports = app;
