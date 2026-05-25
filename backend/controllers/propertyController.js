const mongoose = require("mongoose"); // 1. THÊM DÒNG NÀY Ở ĐẦU FILE để dùng hàm kiểm tra định dạng ID
const Property = require("../models/Property");
const Favourite = require("../models/Favourite");
const User = require("../models/User");

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
            contactPhone,
            images,
            userId
        } = req.body;

        if (!title || !description || !type || !propertyType || !price || !area || !location || !contactPhone || !userId) {
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
            contactPhone,
            images,
            userId,
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
        
        const property = await Property.findById(id).lean(); 

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        // 2. TỐI ƯU ĐIỀU KIỆN TÌM KIẾM ĐỂ TRÁNH LỖI CASTERROR 500
        // Mặc định chúng ta sẽ chỉ tìm User dựa trên trường clerkId (vì userId của bài đăng là chuỗi dạng Clerk)
        let queryCondition = { clerkId: property.userId };

        // Chỉ khi nào property.userId có cấu trúc đúng định dạng 24 ký tự Hex của MongoDB ObjectId, 
        // chúng ta mới thêm điều kiện tìm kiếm bằng _id để tránh bị crash.
        if (mongoose.Types.ObjectId.isValid(property.userId)) {
            queryCondition = {
                $or: [
                    { clerkId: property.userId },
                    { _id: property.userId }
                ]
            };
        }

        const owner = await User.findOne(queryCondition).select("fullName avatar");

        property.owner = owner ? {
            fullName: owner.fullName,
            avatar: owner.avatar
        } : { fullName: "Người dùng hệ thống", avatar: "" };

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
        });
    }
};

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

const toggleFavorite = async (req, res) => {
    try {
        const { propertyId, userId } = req.body;

        if (!propertyId || !userId) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin propertyId hoặc userId" });
        }

        const existingFavorite = await Favourite.findOne({ userId, propertyId });

        if (existingFavorite) {
            await Favourite.findByIdAndDelete(existingFavorite._id);
            return res.status(200).json({
                success: true,
                isFavorite: false,
                message: "Đã xóa khỏi danh sách yêu thích"
            });
        } else {
            const newFavorite = new Favourite({ userId, propertyId });
            await newFavorite.save();
            return res.status(200).json({
                success: true,
                isFavorite: true,
                message: "Đã thêm vào danh sách yêu thích"
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error.message });
    }
};

const getFavoriteProperties = async (req, res) => {
    try {
        const { userId } = req.params;

        const favorites = await Favourite.find({ userId }).populate({
            path: "propertyId",
            match: { status: "approved" }
        });

        const favoriteProperties = favorites
            .filter(fav => fav.propertyId !== null)
            .map(fav => fav.propertyId);

        res.status(200).json({
            success: true,
            data: favoriteProperties
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách yêu thích", error: error.message });
    }
};

const checkFavoriteStatus = async (req, res) => {
    try {
        const { userId, propertyId } = req.params;
        
        const existingFavorite = await Favourite.findOne({ userId, propertyId });
        
        res.status(200).json({ 
            isFavorite: !!existingFavorite
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createProperty,
    getApprovedProperties,
    getPropertyById,
    getUserProperties,
    deleteProperty,
    updateProperty,
    toggleFavorite,
    getFavoriteProperties,
    checkFavoriteStatus
}