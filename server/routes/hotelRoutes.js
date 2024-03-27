const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const db = new sqlite3.Database('./db/hotel_database.db');

// Get all hotels for a specific hotel chain
router.get('/hotel-chain/:hotelChainId/hotels', (req, res) => {
  const { hotelChainId } = req.params;
  db.all('SELECT * FROM Hotel WHERE hotelChainID = ?', [hotelChainId], (err, rows) => {
    if (err) {
      res.status(500).send('Error querying the database');
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
