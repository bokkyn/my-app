const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  prompt: { type: String, required: true },
  query: { type: Array, required: true }, // MongoDB aggregation pipeline
  results: { type: Array, required: true }, // Stores query results
  club: { type: String, default: null }, // ✅ Dodano
});

const Prompt = mongoose.model("Prompt", promptSchema, "Prompts");

// ✅ Dohvati današnji prompt ili random ako ne postoji
router.get("/today", async (req, res) => {
  try {
    const todayDate = new Date().toISOString().split("T")[0];
    const todayPrompt = await Prompt.findOne({ date: todayDate });

    if (todayPrompt) {
      return res.json(todayPrompt);
    } else {
      const randomPrompt = await Prompt.aggregate([{ $sample: { size: 1 } }]);
      return res.json(
        randomPrompt.length
          ? randomPrompt[0]
          : { message: "No prompts available." }
      );
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ✅ Dohvati random prompt
router.get("/random", async (req, res) => {
  try {
    const count = await Prompt.countDocuments();
    if (count === 0)
      return res.status(404).json({ message: "No prompts available." });

    const randomPrompt = await Prompt.aggregate([{ $sample: { size: 1 } }]);
    res.json(randomPrompt[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ✅ Spremi novi prompt
router.post("/", async (req, res) => {
  try {
    const { date, prompt, query, club } = req.body;

    if (!date || !prompt || !query) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existingPrompt = await Prompt.findOne({ date });
    if (existingPrompt) {
      return res
        .status(400)
        .json({ message: "A prompt for this date already exists." });
    }

    const newPrompt = new Prompt({
      date,
      prompt,
      query,
      results: [],
      club: club || null, // ✅ Dodano
    });

    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/club/:clubName", async (req, res) => {
  try {
    const clubName = req.params.clubName;
    const prompts = await Prompt.find({ club: clubName });
    if (prompts.length === 0) {
      return res
        .status(404)
        .json({ message: "No prompts found for this club." });
    }
    res.json(prompts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
