const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cors = require("cors");

router.use(cors());

// -----------------------------------------------------------------------------

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

const Footballer = mongoose.model(
  "Footballer",
  footballerSchema,
  "Footballers"
);

// ----------------------DOHVAT SVIH NOGOMETAŠA----------------------------
router.get("/", async (req, res) => {
  try {
    const footballers = await Footballer.find();
    console.log("Fetched footballers:", footballers); // Log fetched data
    res.status(200).json(footballers);
  } catch (error) {
    console.error("Error fetching footballers:", error); // Log error
    res.status(500).send(error.message);
  }
});

router.post("/query", (req, res) => {
  const query = req.body.query;

  // Pretpostavimo da koristimo MongoDB
  Footballer.aggregate(query)
    .then((result) => res.json(result))
    .catch((err) =>
      res.status(500).json({ error: "Pogreška pri dohvaćanju podataka" })
    );
});

module.exports = router;
