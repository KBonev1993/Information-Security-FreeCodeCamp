// models/Stock.js
const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  stock: String,
  likes: { type: Number, default: 0 },
  ips: [String] // Array of anonymized IP addresses
});

module.exports = mongoose.model('Stock', StockSchema);
