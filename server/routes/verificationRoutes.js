const express = require('express');
const router = express.Router();
const { verifyClaims } = require('../controllers/verificationController');

router.post('/', verifyClaims);

module.exports = router;
