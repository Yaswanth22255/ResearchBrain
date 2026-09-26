const express = require('express');
const router = express.Router();
const { searchLiterature } = require('../controllers/searchController');

router.post('/', searchLiterature);

module.exports = router;
