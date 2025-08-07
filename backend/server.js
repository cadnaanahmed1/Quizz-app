const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// --- Mongoose Schemas & Models ---

// Quiz Schema
const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true } // index of correct option
});

const Quiz = mongoose.model("Quiz", quizSchema);

const resultSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true }, // ← Waa in la aqbalaa!
  date: { type: Date, default: Date.now }
});



//const Result = mongoose.model("Result", resultSchema);
const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);


// --- Routes ---

// Test route
app.get("/", (req, res) => {
  res.send("Quiz backend is running...");
});

// Create new quiz question
app.post("/api/quizzes", async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    if (!question || !options || typeof correctAnswer !== "number") {
      return res.status(400).json({ error: "Invalid quiz data" });
    }
    const newQuiz = new Quiz({ question, options, correctAnswer });
    await newQuiz.save();
    res.status(201).json({ message: "Quiz question saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all quiz questions
app.get("/api/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/results", async (req, res) => {
  try {
    const { username, score, total } = req.body;

    // Hubinta saxnaanta xogta la keenay
    if (!username || typeof score !== "number" || typeof total !== "number") {
      return res.status(400).json({ error: "Invalid result data" });
    }

    // Diiwaangelinta natiijada cusub
    const newResult = new Result({ username, score, total });
    await newResult.save();

    res.status(201).json({ message: "Result saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete all quizzes - for admin (should protect with PIN in real app)
app.delete("/api/quizzes", async (req, res) => {
  try {
    await Quiz.deleteMany({});
    res.json({ message: "All quizzes deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk create multiple questions
app.post("/api/quizzes/bulk", async (req, res) => {
  try {
    const quizzes = req.body;
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      return res.status(400).json({ error: "Invalid quiz list" });
    }

    // Validate each quiz
    for (const quiz of quizzes) {
      if (!quiz.question || !quiz.options || typeof quiz.correctAnswer !== "number") {
        return res.status(400).json({ error: "Invalid quiz format" });
      }
    }

    await Quiz.insertMany(quizzes);
    res.status(201).json({ message: "All questions saved." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Get all results sorted by score descending
app.get("/api/results", async (req, res) => {
  try {
    const results = await Result.find().sort({ score: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/results", async (req, res) => {
  try {
    await Result.deleteMany({});
    res.status(200).json({ message: "All results deleted successfully" });
  } catch (error) {
    console.error("Error deleting results:", error);
    res.status(500).json({ message: "Error deleting results", error });
  }
});

app.get("/api/results/total-default", async (req, res) => {
  try {
    const resultWithTotal = await Result.find({ total: { $exists: true, $ne: null } })
      .sort({ date: -1 })
      .limit(1);
    
    const defaultTotal = resultWithTotal.length > 0 ? resultWithTotal[0].total : "?";
    res.json({ defaultTotal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
