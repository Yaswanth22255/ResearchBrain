const express = require('express');
const router = express.Router();
const { createSummary } = require('../controllers/ragController');

router.post('/', createSummary);

module.exports = router;
