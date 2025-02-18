const express = require("express");
const footballersRouter = require("../routes/footballers");
const promptsRouter = require("../routes/prompts");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ CORS konfiguracija
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://tenable-croatia-p8yly6fxo-bokkyns-projects.vercel.app", // Stavi pravi URL frontenda
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Povezivanje na MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error("Greška pri spajanju:", error));
db.once("open", () => console.log("Spojeni smo na MongoDB bazu"));

// ✅ Postavljanje API ruta
app.use("/footballers", footballersRouter);
app.use("/prompts", promptsRouter);

// ❌ Uklanjamo `app.listen()`, jer Vercel ne koristi klasični server
module.exports = app;
