const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema({
  clubs: [String],
  goals_scored: Number,
  yellow_cards: Number,
  red_cards: Number,
  matches_played: Number,
  minutes_played: Number,
});

const footballerSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  seasons: {
    type: Map,
    of: seasonSchema,
  },
});

const Footballer = mongoose.model("Footballer", footballerSchema, "Footballers");

// ----------------------DOHVAT SVIH NOGOMETAŠA----------------------------
router.get("/", async (req, res) => {
  try {
    const footballers = await Footballer.find();
    res.status(200).json(footballers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/query", async (req, res) => {
  const query = req.body.query;

  try {
    const result = await Footballer.aggregate(query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Pogreška pri dohvaćanju podataka" });
  }
});

module.exports = router;
