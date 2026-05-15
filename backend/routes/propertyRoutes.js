const express = require('express');
const { getApprovedProperties, createProperty, getUserProperties, updateProperty, deleteProperty, getPropertyById } = require('../controllers/propertyController');

const router = express.Router();

router.get('/', getApprovedProperties);
router.get('/:id', getPropertyById);
router.post('/create', createProperty);
router.get('/user/:userId', getUserProperties);
router.put('/update/:id', updateProperty);
router.delete('/delete/:id', deleteProperty);

module.exports = router;