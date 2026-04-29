const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- CONNECTION STRING ---
const mongoURI = "mongodb+srv://saylanitoken:saylani1122@tokensistem.2srzraz.mongodb.net/saylani_db?retryWrites=true&w=majority&appName=tokensistem";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected! Saylani Database is Ready."))
  .catch((err) => {
    console.log("❌ DB Connection Error:");
    console.log(err.message);
  });

// Token Model
const Token = mongoose.model('Token', new mongoose.Schema({
  tokenNumber: Number,
  type: String,
  reason: String,
  cnicOrFile: String,
  createdAt: { type: Date, default: Date.now }
}));

// API Route to Generate Token
app.post('/api/generate-token', async (req, res) => {
  try {
    const { type, reason, cnicOrFile } = req.body;

    // Aaj ki date (Bina time ke)
    const todayStr = new Date().toISOString().split('T')[0]; 
    const startOfToday = new Date(todayStr); // 2026-04-27 00:00:00
    const endOfToday = new Date(todayStr);
    endOfToday.setHours(23, 59, 59, 999); // 2026-04-27 23:59:59

    // Check karein aaj ke tokens
    const lastToken = await Token.findOne({
      type: type,
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    }).sort({ tokenNumber: -1 });

    const nextNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const newToken = new Token({
      tokenNumber: nextNumber,
      type,
      reason,
      cnicOrFile,
      createdAt: new Date() 
    });

    await newToken.save();
    console.log(`Token Created: ${type}-${nextNumber}`);
    res.status(201).json(newToken);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chal raha hai port: ${PORT} par`);
});