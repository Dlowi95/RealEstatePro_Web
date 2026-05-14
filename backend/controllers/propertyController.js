const Property = require("../models/Property");

const createProperty = async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            propertyType,
            price,
            area,
            location,
            images,
            userId
        } = req.body;

        if (!title || !description || !type || !propertyType || !price || !area || !location || !userId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const newProperty = new Property({
            title,
            description,
            type,
            propertyType,
            price,
            area,
            location: {
                province: location?.province,
                district: location?.district,
                address: location?.address
            },
            images,
            userId
        });

        const savedProperty = await newProperty.save();

        res.status(201).json({
            success: true,
            message: "Property created successfully",
            data: savedProperty
        });
    } catch (error) {
        console.log("Error creating property:", error);
        res.status(500).json({
            success: false,
            message: "Server error, please try again later",
            error: error.message
        })
    }
}

const getApprovedProperties = async (req, res) => {
    try {
        const properties = await Property.find({ status: 'approved' }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        console.log("Error fetching properties:", error);
        res.status(500).json({
            success: false,
            message: "Server error, please try again later",
            error: error.message
        })
    }
}

module.exports = {
    createProperty,
    getApprovedProperties
}