const express = require("express");
const footballersRouter = require("../routes/footballers");
const promptsRouter = require("../routes/prompts");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Stavi pravi URL frontenda
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server radi!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error("Greška pri spajanju:", error));
db.once("open", () => console.log("Spojeni smo na MongoDB bazu"));

app.use("/footballers", footballersRouter);
app.use("/prompts", promptsRouter);
module.exports = app;
