const express = require('express');
const { getApprovedProperties, createProperty, getUserProperties, updateProperty, deleteProperty, getPropertyById, toggleFavorite, getFavoriteProperties, checkFavoriteStatus } = require('../controllers/propertyController');

const router = express.Router();

router.get('/', getApprovedProperties);
router.get('/:id', getPropertyById);
router.post('/create', createProperty);
router.get('/user/:userId', getUserProperties);
router.put('/update/:id', updateProperty);
router.delete('/delete/:id', deleteProperty);

router.post('/favorites/toggle', toggleFavorite);
router.get('/favorites/:userId', getFavoriteProperties);
router.get('/favorites/check/:userId/:propertyId', checkFavoriteStatus);

module.exports = router;