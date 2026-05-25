const User = require("../models/User");
const Property = require("../models/Property");
const Notification = require("../models/Notification");

// Hàm Helper phụ trách việc tạo thông báo lưu DB và phát Real-time qua Socket.io
const createAndSendNotification = async (
  req,
  { userId, title, message, propertyId },
) => {
  try {
    // 1. Lưu thông báo vào Database để làm lịch sử xem lại
    const newNotification = new Notification({
      userId,
      title,
      message,
      propertyId,
    });
    const savedNotification = await newNotification.save();

    // 2. Lấy instance Socket.io và danh sách onlineUsers đã cấu hình từ server.js
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    if (io && onlineUsers) {
      const userSocketId = onlineUsers.get(userId);
      if (userSocketId) {
        // Nếu user đang online (có socketId), bắn thông báo real-time xuống client ngay lập tức
        io.to(userSocketId).emit("new_notification", savedNotification);
      }
    }
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý gửi thông báo:", error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });
    const userCount = totalUsers - adminCount;
    return res.json({ totalUsers, adminCount, userCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User promoted to admin", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();

    const populatedProperties = await Promise.all(
      properties.map(async (prop) => {
        const user = await User.findOne({ clerkId: prop.userId }).select(
          "fullName email avatar",
        );
        return { ...prop, user: user || prop.userId };
      }),
    );

    return res.json({ properties: populatedProperties });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

<<<<<<< Updated upstream
exports.getCurrentApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" })
=======
exports.getHiddenProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "hidden" })
>>>>>>> Stashed changes
      .sort({ createdAt: -1 })
      .lean();

    const populatedProperties = await Promise.all(
      properties.map(async (prop) => {
        const user = await User.findOne({ clerkId: prop.userId }).select(
<<<<<<< Updated upstream
          "fullName email avatar"
        );
        return { ...prop, user: user || prop.userId };
      })
=======
          "fullName email avatar",
        );
        return { ...prop, user: user || prop.userId };
      }),
>>>>>>> Stashed changes
    );

    return res.json({ properties: populatedProperties });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

<<<<<<< Updated upstream
=======
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({})
      .sort({ createdAt: -1 })
      .lean();

    const populatedProperties = await Promise.all(
      properties.map(async (prop) => {
        const user = await User.findOne({ clerkId: prop.userId }).select(
          "fullName email avatar",
        );
        return { ...prop, user: user || prop.userId };
      }),
    );

    return res.json({ properties: populatedProperties });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
>>>>>>> Stashed changes

// CẬP NHẬT: Duyệt bài đăng + Gửi thông báo
exports.approveProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true },
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    // Gửi thông báo đến người dùng (userId ở đây chính là clerkId được lưu trong Property)
    await createAndSendNotification(req, {
      userId: property.userId,
      title: "Tin đăng đã được duyệt! 🎉",
      message: `Chúc mừng! Tin đăng "${property.title}" của bạn đã được kiểm duyệt và hiển thị công khai.`,
      propertyId: property._id,
    });

    return res.json({ success: true, property });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CẬP NHẬT: Ẩn / Hiện bài đăng + Gửi thông báo theo trạng thái tương ứng
exports.toggleHideProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    // Đảo ngược trạng thái hiện tại
    property.status = property.status === "hidden" ? "approved" : "hidden";
    await property.save();

    // Chuẩn bị nội dung thông báo động dựa trên trạng thái mới
    let title = "";
    let message = "";

    if (property.status === "hidden") {
      title = "Tin đăng của bạn đã bị ẩn ⚠️";
      message = `Tin đăng "${property.title}" của bạn đã bị ẩn bởi ban quản trị hệ thống.`;
    } else {
      title = "Tin đăng đã được hiển thị lại! ✨";
      message = `Tin đăng "${property.title}" của bạn đã được khôi phục trạng thái hiển thị công khai.`;
    }

    // Tiến hành gửi thông báo hỗn hợp
    await createAndSendNotification(req, {
      userId: property.userId,
      title,
      message,
      propertyId: property._id,
    });

    return res.json({ success: true, property });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStatsByArea = async (req, res) => {
  try {
    const stats = await Property.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$location.province", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return res.json({ stats });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBlocked = !user.isBlocked;
    await user.save();
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { fullName, phoneNumber },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ success: true, message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};