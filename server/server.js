const path = require("path");
const express = require("express");
const footballersRouter = require("./routes/footballers");
const promptsRouter = require("./routes/prompts");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// CORS setup
app.use(
  cors({
    origin: "http://localhost:5173", // Ako testiraš lokalno, koristi ovu adresu
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("Greška pri spajanju:", error);
});
db.once("open", function () {
  console.log("Spojeni smo na MongoDB bazu");
});

// Backend API routes
app.use("/footballers", footballersRouter);
app.use("/prompts", promptsRouter);

// Serviranje React frontend build-a
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist"))); // Promeni putanju ako je drugačija

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html")); // Ponovo, možeš promeniti putanju
  });
}

// Pokreni server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
