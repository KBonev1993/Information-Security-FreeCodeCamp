// api.js
'use strict';

const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const Stock = require('../models/Stock');
const crypto = require('crypto');

// Function to anonymize IP
function anonymizeIp(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

// Helper function to get stock data
async function getStockData(stock) {
  const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }
  return response.json();
}

router.get('/stock-prices', async (req, res) => {
  console.log('Received request for stock:', req.query.stock);
  const startTime = new Date();

  let stocks = [].concat(req.query.stock); // Ensure stocks is an array
  const like = req.query.like === 'true';
  const ip = anonymizeIp(req.headers['x-forwarded-for'] || req.connection.remoteAddress);

  try {
    // Fetch stock data for all stocks
    const stockDataPromises = stocks.map(stock => getStockData(stock));
    const stockDataResults = await Promise.all(stockDataPromises);

    // Process each stock
    const processedStockData = await Promise.all(stockDataResults.map(async (data, index) => {
      if (!data.symbol) {
        throw new Error('Invalid data received from the stock API');
      }

      let stockDoc = await Stock.findOne({ stock: data.symbol });

      if (!stockDoc) {
        stockDoc = new Stock({ stock: data.symbol, ips: [] });
      }

      if (like && !stockDoc.ips.includes(ip)) {
        stockDoc.likes++;
        stockDoc.ips.push(ip);
        await stockDoc.save();
      }

      return {
        stock: data.symbol,
        price: data.latestPrice,
        likes: stockDoc.likes
      };
    }));

    // If only one stock, return it, otherwise calculate rel_likes
    let output;
    if (processedStockData.length === 1) {
      output = { stockData: processedStockData[0] };
    } else {
      const rel_likes = processedStockData.map(data => data.likes - processedStockData[(processedStockData.indexOf(data) + 1) % processedStockData.length].likes);
      output = {
        stockData: processedStockData.map((data, i) => ({
          stock: data.stock,
          price: data.price,
          rel_likes: rel_likes[i]
        }))
      };
    }

    console.log(`Response time for ${stocks.join(', ')}: ${new Date() - startTime}ms`);
    res.json(output);
  } catch (error) {
    console.error('Error during fetch:', error);
    res.status(500).json({ error: 'Error fetching stock data' });
    console.log(`Response time for ${stocks.join(', ')} with error: ${new Date() - startTime}ms`);
  }
});

module.exports = router;
