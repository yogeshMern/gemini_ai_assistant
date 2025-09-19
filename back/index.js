require("dotenv").config();
const express = require("express");
const cors = require("cors");
const geminiRoutes = require("./routes/geminiRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/gemini", geminiRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
