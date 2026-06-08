const mongoose = require("mongoose");
const Property = require("../models/Property");
const Favourite = require("../models/Favourite");
const User = require("../models/User");

// --- HÀM HEURISTICS CHẤM ĐIỂM CHẤT LƯỢNG TIN (TỐI ĐA 100 ĐIỂM HOÀN CHỈNH) ---
const calculatePropertyScore = (data) => {
  let score = 0;

  // 1. Tiêu chí Số lượng hình ảnh (Tối đa 30 điểm)
  const imgCount = data.images?.length || 0;
  if (imgCount >= 3) {
    score += 30; // Đầy đủ góc nhìn không gian trực quan rõ ràng
  } else if (imgCount === 1 || imgCount === 2) {
    score += 15;
  }

  // 2. Tiêu chí Độ dài văn bản mô tả (Tối đa 30 điểm)
  const descLen = data.description?.length || 0;
  if (descLen > 100) {
    score += 30; // Nội dung đầu tư, mô tả chi tiết tiện ích xung quanh
  } else if (descLen >= 20) {
    score += 15;
  } else if (descLen > 0) {
    score += 5;
  }

  // 3. Tiêu chí Đầy đủ thông tin cốt lõi dựa trên Form UI (Tối đa 40 điểm)
  
  // 3.1. Độ chính xác Vị trí (Tối đa 15 điểm)
  const hasProvince = !!data.location?.province;
  const hasWard = !!data.location?.ward;
  const hasAddress = !!data.location?.address;
  // Bắt buộc phải điền đủ cả 3 cấp Tỉnh/Thành + Xã/Phường + Địa chỉ chi tiết mới được điểm
  if (hasProvince && hasWard && hasAddress) {
    score += 15;
  }

  // 3.2. Định danh Giao dịch (Tối đa 15 điểm)
  const priceNum = Number(data.price) || 0;
  const areaNum = Number(data.area) || 0;
  const hasPhone = !!data.contactPhone;
  if (priceNum > 0 && areaNum > 0 && hasPhone) {
    score += 15;
  }

  // 3.3. Tiêu đề & Phân loại bộ lọc (Tối đa 10 điểm)
  const titleLen = data.title?.length || 0;
  const hasType = !!data.type;
  const hasPropertyType = !!data.propertyType;
  if (titleLen > 10 && hasType && hasPropertyType) {
    score += 10;
  }


  // 4. Bộ lọc phát hiện từ khóa Spam / Clickbait / Rủi ro pháp lý bất động sản (Trừ thẳng tay 20 điểm)
  const spamKeywords = [
    "vi bằng",           
    "sổ chung",
    "cắt lỗ sâu",
    "ngộp ngân hàng",
    "vỡ nợ bán gấp",
    "bán rẻ",
    "giá shock",
  ];

  // Gộp tiêu đề và mô tả, chuyển về chữ thường để quét chống bypass viết hoa chữ cái
  const contentToSearch = `${data.title || ""} ${data.description || ""}`.toLowerCase();
  const hasSpam = spamKeywords.some((keyword) => contentToSearch.includes(keyword));
  if (hasSpam) {
    score -= 20;
  }

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
      userId,
    } = req.body;

    if (!title || !description || !type || !propertyType || !price || !area || !location || !contactPhone || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Nạp đầy đủ các trường thông tin vào hàm chấm điểm Heuristic
    const calculatedScore = calculatePropertyScore({
      title,
      description,
      images,
      contactPhone,
      area,
      price,
      type,
      propertyType,
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

// 2. LẤY DANH SÁCH TIN ĐA DUYỆT (Ưu tiên bài nhiều lượt xem lên đầu làm Tin Nổi Bật)
const getApprovedProperties = async (req, res) => {
  try {
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

// 3. XEM CHI TIẾT TIN ĐĂNG (Chống Spam View chuẩn chỉnh)
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // Nhận từ URL frontend truyền lên qua ?userId=...

    let property;

    if (userId) {
      // Kiểm tra xem tài khoản này đã từng bấm xem bài đăng này chưa
      const hasViewed = await Property.findOne({ _id: id, viewedUsers: userId });

      if (!hasViewed) {
        // Nếu chưa xem: tăng trường views lên +1 và nạp userId vào mảng để khóa lại
        property = await Property.findByIdAndUpdate(
          id,
          { 
            $inc: { views: 1 },
            $push: { viewedUsers: userId }
          },
          { new: true }
        ).lean();
      } else {
        // Nếu đã xem rồi: Chỉ đọc thông tin hiện tại, giữ nguyên lượt xem
        property = await Property.findById(id).lean();
      }
    } else {
      // Khách vãng lai chưa đăng nhập: Chỉ cho phép xem dữ liệu thuần, không tính lượt xem
      property = await Property.findById(id).lean();
    }

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Logic tìm kiếm và gán thông tin chủ sở hữu (Owner) bài đăng
    let queryCondition = { clerkId: property.userId };

    if (mongoose.Types.ObjectId.isValid(property.userId)) {
      queryCondition = {
        $or: [{ clerkId: property.userId }, { _id: property.userId }],
      };
    }

    const owner = await User.findOne(queryCondition).select("fullName avatar");

    property.owner = owner
      ? {
          fullName: owner.fullName,
          avatar: owner.avatar,
        }
      : { fullName: "Người dùng hệ thống", avatar: "" };

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.log("Error fetching property:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: error.message,
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
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa bài đăng",
      error: error.message,
    });
  }
};

// 6. CẬP NHẬT TIN ĐĂNG VÀ TÍNH TOÁN LẠI ĐIỂM SỐ CHẤT LƯỢNG TIN
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const currentProperty = await Property.findById(id);
    if (!currentProperty) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài đăng" });
    }

    // Trộn thông tin cũ và thông tin cập nhật mới để tránh mất trường dữ liệu khi tính điểm
    const mergedData = {
      title: updateData.title !== undefined ? updateData.title : currentProperty.title,
      description: updateData.description !== undefined ? updateData.description : currentProperty.description,
      images: updateData.images !== undefined ? updateData.images : currentProperty.images,
      contactPhone: updateData.contactPhone !== undefined ? updateData.contactPhone : currentProperty.contactPhone,
      area: updateData.area !== undefined ? updateData.area : currentProperty.area,
      price: updateData.price !== undefined ? updateData.price : currentProperty.price,
      type: updateData.type !== undefined ? updateData.type : currentProperty.type,
      propertyType: updateData.propertyType !== undefined ? updateData.propertyType : currentProperty.propertyType,
      location: {
        province: updateData.location?.province !== undefined ? updateData.location.province : currentProperty.location?.province,
        ward: updateData.location?.ward !== undefined ? updateData.location.ward : currentProperty.location?.ward,
        address: updateData.location?.address !== undefined ? updateData.location.address : currentProperty.location?.address,
      },
    };

    // Tính lại điểm chất lượng tin mới sau khi người dùng sửa bài dựa trên dữ liệu đã gộp
    updateData.score = calculatePropertyScore(mergedData);
    updateData.status = "pending"; // Reset trạng thái về chờ duyệt khi có bất cứ thao tác chỉnh sửa nào

    const updatedProperty = await Property.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công, tin đang chờ duyệt lại và đã được cập nhật điểm số.",
      data: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật bài đăng",
      error: error.message,
    });
  }
};

// 7. YÊU THÍCH / BỎ YÊU THÍCH TIN
const toggleFavorite = async (req, res) => {
  try {
    const { propertyId, userId } = req.body;

    if (!propertyId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin propertyId hoặc userId",
      });
    }

    const existingFavorite = await Favourite.findOne({ userId, propertyId });

    if (existingFavorite) {
      await Favourite.findByIdAndDelete(existingFavorite._id);
      return res.status(200).json({
        success: true,
        isFavorite: false,
        message: "Đã xóa khỏi danh sách yêu thích",
      });
    } else {
      const newFavorite = new Favourite({ userId, propertyId });
      await newFavorite.save();
      return res.status(200).json({
        success: true,
        isFavorite: true,
        message: "Đã thêm vào danh sách yêu thích",
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
      match: { status: "approved" },
    });

    const favoriteProperties = favorites
      .filter((fav) => fav.propertyId !== null)
      .map((fav) => fav.propertyId);

    res.status(200).json({
      success: true,
      data: favoriteProperties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách yêu thích",
      error: error.message,
    });
  }
};

// 9. KIỂM TRA TRẠNG THÁI YÊU THÍCH CỦA TIN ĐỐI VỚI USER
const checkFavoriteStatus = async (req, res) => {
  try {
    const { userId, propertyId } = req.params;

    const existingFavorite = await Favourite.findOne({ userId, propertyId });

    res.status(200).json({
      isFavorite: !!existingFavorite,
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
  checkFavoriteStatus,
};