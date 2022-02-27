const express = require("express"),
  multer = require("multer"),
  ejs = require("ejs"),
  path = require("path");

// Setting the storage engine
const storage = multer.diskStorage({
  destination: path.join(__dirname, "/public/uploads"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Init upload
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const fileTypes = /jpeg|jpg|png|gif/;

    // Check extname and mimetype
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (extname) {
      return cb(null, true);
    } else {
      return cb("Error: File type not supported!");
    }
  },
}).single("myFile");

const app = express();

// EJS
app.set("view engine", "ejs");

// Public
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err,
      });
    } else {
      if (req.file === undefined) {
        res.render("index", {
          msg: "Error: No file selected!",
        });
      } else {
        res.render("index", {
          msg: "File uploaded!",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}...`));
