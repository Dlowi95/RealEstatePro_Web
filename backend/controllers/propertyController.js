const Property = require("../models/Property");
const Favourite = require("../models/Favourite");

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

// 1. Bật/Tắt trạng thái yêu thích (Toggle Favorite)
const toggleFavorite = async (req, res) => {
    try {
        const { propertyId, userId } = req.body; // userId là clerkId từ frontend gửi lên

        if (!propertyId || !userId) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin propertyId hoặc userId" });
        }

        // Kiểm tra xem cặp userId và propertyId này đã tồn tại trong DB chưa
        const existingFavorite = await Favourite.findOne({ userId, propertyId });

        if (existingFavorite) {
            // Nếu ĐÃ TỒN TẠI -> Người dùng muốn BỎ YÊU THÍCH (Unlike)
            await Favourite.findByIdAndDelete(existingFavorite._id);
            return res.status(200).json({
                success: true,
                isFavorite: false,
                message: "Đã xóa khỏi danh sách yêu thích"
            });
        } else {
            // Nếu CHƯA TỒN TẠI -> Người dùng muốn YÊU THÍCH (Like)
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

// 2. Lấy danh sách tất cả các BĐS đã yêu thích của một User
const getFavoriteProperties = async (req, res) => {
    try {
        const { userId } = req.params; // nhận clerkId từ params

        // Tìm tất cả bản ghi yêu thích của user này và populate thông tin BĐS tương ứng
        const favorites = await Favourite.find({ userId }).populate({
            path: "propertyId",
            match: { status: "approved" } // Chỉ lấy các tin đã được Admin duyệt công khai
        });

        // Định dạng lại dữ liệu trả về: Chỉ lọc lấy các Object bài đăng BĐS hợp lệ (loại bỏ những bài đăng null do chưa duyệt)
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

// 3. Kiểm tra bài đăng cụ thể này đã được User yêu thích hay chưa khi load trang chi tiết
const checkFavoriteStatus = async (req, res) => {
    try {
        const { userId, propertyId } = req.params;
        
        const existingFavorite = await Favourite.findOne({ userId, propertyId });
        
        res.status(200).json({ 
            isFavorite: !!existingFavorite // Trả về true nếu tìm thấy bản ghi, ngược lại là false
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