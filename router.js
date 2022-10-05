const express = require('express');

const router = express.Router();

router.get(`${URL}/`, (req, res) => {
  

  res.status(200).json(races);
});

module.exports = router;