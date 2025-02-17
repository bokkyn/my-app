const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  prompt: { type: String, required: true },
  query: { type: Array, required: true }, // MongoDB aggregation pipeline
  results: { type: Array, required: true }, // Stores query results
});

const Prompt = mongoose.model("Prompt", promptSchema, "Prompts");

// ✅ Route: Get today's prompt or a random one if today's prompt doesn't exist
router.get("/today", async (req, res) => {
    try {
      const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  
      // Try to find today's prompt
      const todayPrompt = await Prompt.findOne({ date: todayDate });
  
      if (todayPrompt) {
        // If today's prompt exists, return it
        return res.json(todayPrompt);
      } else {
        // If no prompt exists for today, fetch a random prompt
        const randomPrompt = await Prompt.aggregate([{ $sample: { size: 1 } }]);
  
        if (randomPrompt.length > 0) {
          // If a random prompt is found, return it
          return res.json(randomPrompt[0]);
        } else {
          // If no prompts exist at all, return a 404
          return res.status(404).json({ message: "No prompts available." });
        }
      }
    } catch (error) {
      console.error("Error fetching prompt:", error);
      res.status(500).send(error.message);
    }
  });

// ✅ Route: Get a random prompt
router.get("/random", async (req, res) => {
  try {
    const count = await Prompt.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: "No prompts available." });
    }

    const randomPrompt = await Prompt.aggregate([{ $sample: { size: 1 } }]);

    res.json(randomPrompt[0]);
  } catch (error) {
    console.error("Error fetching random prompt:", error);
    res.status(500).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { date, prompt, query } = req.body;

    // Validate request body
    if (!date || !prompt || !query) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if a prompt with the same date already exists
    const existingPrompt = await Prompt.findOne({ date });
    if (existingPrompt) {
      return res
        .status(400)
        .json({ message: "A prompt for this date already exists." });
    }

    // Create and save the new prompt
    const newPrompt = new Prompt({
      date,
      prompt,
      query,
      results: [], // Empty results initially
    });

    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (error) {
    console.error("Error saving prompt:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
