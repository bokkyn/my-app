const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import ruta
const footballersRouter = require("./footballers");
const promptsRouter = require("./prompts");

const app = express();

// CORS za frontend na Netlifyu
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Spoji se na MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error("Greška pri spajanju:", error));
db.once("open", () => console.log("Spojeni smo na MongoDB bazu"));

// 🔹 Dodaj rute
app.use("/footballers", footballersRouter);
app.use("/prompts", promptsRouter);

module.exports.handler = serverless(app);
