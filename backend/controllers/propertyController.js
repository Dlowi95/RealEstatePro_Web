const mongoose = require("mongoose"); 
const Property = require("../models/Property");
const Favourite = require("../models/Favourite");
const User = require("../models/User");

// --- HÀM HEURISTICS CHẤM ĐIỂM CHẤT LƯỢNG TIN (TỐI ĐA 100 ĐIỂM) ---
const calculatePropertyScore = (data) => {
    let score = 0;

    // 1. Tiêu chí Số lượng hình ảnh (Tối đa 25 điểm)
    const imgCount = data.images?.length || 0;
    if (imgCount >= 3) {
        score += 25;
    } else if (imgCount === 1 || imgCount === 2) {
        score += 10;
    }

    // 2. Tiêu chí Độ dài văn bản mô tả (Tối đa 25 điểm)
    const descLen = data.description?.length || 0;
    if (descLen > 100) {
        score += 25;
    } else if (descLen >= 20) {
        score += 15;
    } else if (descLen > 0) {
        score += 5;
    }

    // 3. Tiêu chí Đầy đủ thông tin cốt lõi (Tối đa 30 điểm)
    if (data.contactPhone) score += 10;
    if (data.area) score += 10;
    if (data.location?.address) score += 10;

    // 4. Tiêu chí Phát hiện từ khóa spam/nhạy cảm (Trừ tối đa 20 điểm)
    const spamKeywords = ["cam kết lời gấp đôi", "trúng thưởng lớn", "giá rẻ sập sàn"];
    const contentToSearch = `${data.title || ''} ${data.description || ''}`.toLowerCase();
    const hasSpam = spamKeywords.some(keyword => contentToSearch.includes(keyword));
    if (hasSpam) {
        score -= 20;
    }

    // Giới hạn điểm số từ 0 đến 100
    return Math.max(0, Math.min(score, 100));
};

// 1. ĐĂNG TIN MỚI
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

        const calculatedScore = calculatePropertyScore({
            title,
            description,
            images,
            contactPhone,
            area,
            location
        });

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
            score: calculatedScore,
            views: 0,
            viewedUsers: [] // Khởi tạo mảng rỗng chưa có ai xem
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
        });
    }
};

// 2. LẤY DANH SÁCH TIN ĐÃ DUYỆT (Ưu tiên xếp bài nhiều VIEW nhất lên đầu làm TIN NỔI BẬT)
const getApprovedProperties = async (req, res) => {
    try {
        // Sắp xếp theo views nhiều nhất (-1), rồi đến score chất lượng, cuối cùng là mới nhất
        const properties = await Property.find({ status: 'approved' }).sort({ views: -1, score: -1, createdAt: -1 });

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
        });
    }
};

// 3. XEM CHI TIẾT TIN ĐĂNG (Chống Spam View - Mỗi tài khoản tăng 1 lần duy nhất)
const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query; // Nhận userId truyền từ frontend lên qua url ?userId=...

        let property;

        if (userId) {
            // Kiểm tra xem userId này đã từng xem bài viết này chưa
            const hasViewed = await Property.findOne({ _id: id, viewedUsers: userId });

            if (!hasViewed) {
                // Nếu chưa xem: tăng views lên 1 và đẩy userId vào mảng viewedUsers để khóa lại
                property = await Property.findByIdAndUpdate(
                    id,
                    { 
                        $inc: { views: 1 },
                        $push: { viewedUsers: userId }
                    },
                    { new: true }
                ).lean();
            } else {
                // Nếu đã xem rồi: giữ nguyên views, chỉ đọc dữ liệu
                property = await Property.findById(id).lean();
            }
        } else {
            // Khách vãng lai chưa đăng nhập: chỉ xem, không tăng view để tránh bot cào dữ liệu phá hoại số liệu
            property = await Property.findById(id).lean();
        }

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        let queryCondition = { clerkId: property.userId };

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

// 4. LẤY TIN ĐĂNG CỦA RIÊNG MỘT USER
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
        });
    }
};

// 5. XÓA TIN ĐĂNG
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

// 6. CẬP NHẬT TIN ĐĂNG VÀ TÍNH LẠI ĐIỂM SỐ
const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const currentProperty = await Property.findById(id);
        if (!currentProperty) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bài đăng" });
        }

        const mergedData = {
            title: updateData.title !== undefined ? updateData.title : currentProperty.title,
            description: updateData.description !== undefined ? updateData.description : currentProperty.description,
            images: updateData.images !== undefined ? updateData.images : currentProperty.images,
            contactPhone: updateData.contactPhone !== undefined ? updateData.contactPhone : currentProperty.contactPhone,
            area: updateData.area !== undefined ? updateData.area : currentProperty.area,
            location: {
                address: updateData.location?.address !== undefined ? updateData.location.address : currentProperty.location?.address
            }
        };

        updateData.score = calculatePropertyScore(mergedData);
        updateData.status = 'pending'; // Đẩy về trạng thái chờ duyệt khi sửa đổi nội dung
        
        const updatedProperty = await Property.findByIdAndUpdate(
            id, 
            updateData, 
            { returnDocument: 'after' }
        );

        res.status(200).json({
            success: true,
            message: "Cập nhật thành công, tin đang chờ duyệt lại và đã được cập nhật điểm số.",
            data: updatedProperty
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật bài đăng", error: error.message });
    }
};

// 7. YÊU THÍCH / BỎ YÊU THÍCH TIN
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

// 8. LẤY DANH SÁCH TIN YÊU THÍCH CỦA USER
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

// 9. KIỂM TRA TRẠNG THÁI YÊU THÍCH CỦA TIN ĐỐI VỚI USER
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
};