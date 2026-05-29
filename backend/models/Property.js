const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["Buy", "Rent"], required: true },
    propertyType: { type: String, required: true },
    price: { type: Number, required: true },
    area: { type: Number, required: true },
    location: {
        province: String,
        ward: String,
        address: String
    },
    contactPhone: { type: String, required: true },
    images: [String],
    userId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'hidden'], default: 'pending' },
    score: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Property', propertySchema);