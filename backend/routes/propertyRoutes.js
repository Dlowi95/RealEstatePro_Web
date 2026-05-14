const express = require('express');
const { getApprovedProperties, createProperty } = require('../controllers/propertyController');

const router = express.Router();

router.get('/', getApprovedProperties);
router.post('/create', createProperty);

module.exports = router;