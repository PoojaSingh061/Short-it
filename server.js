const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const ShortUrl = require("./models/shortUrl");

const db = config.get("mongoURI");

const app = express();

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

//Conect to database
connectDb();

PORT = process.env.PORT || 3000;

// set up view to use ejs view engine
app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: false,
  })
);

//For rendering static files
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

//Asynchronous action, wait until execution
app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

//findOne method on database passing our search query
app.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

    if (shortUrl) {
      shortUrl.save();
      return res.redirect(shortUrl.full);
    } else {
      return res.sendStatus(404).json("No URL found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

app.listen(PORT);
