// routes/history.js
// Route to get poll history
const express = require('express');
const Poll = require('../models/Poll');
const router = express.Router();

// GET /history - get all past polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find(
      { endedAt: { $exists: true } }
    ).sort(
      { endedAt: -1 }
    );
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch poll history' });
  }
});

// POST /history - save a finished poll to history
router.post('/', async (req, res) => {
  try {
    const pollData = req.body;
    const poll = new Poll(pollData);
    await poll.save();
    res.status(201).json({ message: 'Poll saved to history', poll });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save poll to history' });
  }
});

module.exports = router; 