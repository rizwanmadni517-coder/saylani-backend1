const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());
app.use(cors({
    origin: 'https://rizwanmadni517-coder.github.io', // Aapka frontend link
    methods: ['POST', 'GET'],
    credentials: true
}));
const tokenSchema = new mongoose.Schema({
  type: String,
  reason: String,
  cnicOrFile: String,
  tokenNumber: Number,
  createdAt: { type: Date, default: Date.now }
});
const Token = mongoose.model('Token', tokenSchema);

app.get("/", (req, res) => res.send("Saylani API is running perfectly!"));

app.post("/api/tokens", async (req, res) => {
  try {
    const count = await Token.countDocuments();
    const newToken = new Token({ ...req.body, tokenNumber: count + 1 });
    await newToken.save();
    res.status(201).json(newToken);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));