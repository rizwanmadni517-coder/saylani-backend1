const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenNumber: { type: Number, unique: true },
  type: { type: String, required: true }, // "One Window" ya "Final"
  reason: { type: String },               // "Shadi", "School Fee", etc.
  cnicOrFile: { type: String },           // CNIC ya File Number
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', tokenSchema);