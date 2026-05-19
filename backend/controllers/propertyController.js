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
                ward: location?.ward,
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

const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        console.log("Error fetching property:", error);
        res.status(500).json({
            success: false,
            message: "Server error, please try again later",
            error: error.message
        })
    }
}

const getUserProperties = async (req, res) => {
    try {
        const { userId } = req.params;

        const properties = await Property.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        console.log("Error fetching user properties:", error);
        res.status(500).json({
            success: false,
            message: "Server error, please try again later",
            error: error.message
        })
    }
}

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProperty = await Property.findByIdAndDelete(id);

        if (!deletedProperty) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bài đăng" });
        }

        res.status(200).json({ success: true, message: "Xóa bài đăng thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi xóa bài đăng", error: error.message });
    }
};
const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        updateData.status = 'pending';

        const updatedProperty = await Property.findByIdAndUpdate(
            id, 
            updateData, 
            { returnDocument: 'after' }
        );

        res.status(200).json({
            success: true,
            message: "Cập nhật thành công, tin đang chờ duyệt lại.",
            data: updatedProperty
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật bài đăng", error: error.message });
    }
};

module.exports = {
    createProperty,
    getApprovedProperties,
    getPropertyById,
    getUserProperties,
    deleteProperty,
    updateProperty
}