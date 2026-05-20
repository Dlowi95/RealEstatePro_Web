const User = require("../models/User");
const Property = require("../models/Property");

// ===== Các hàm cũ =====
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    return res.json({ users });
  } catch (error) {
    console.error("Admin getUsers error:", error);
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
    console.error("Admin stats error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const user = await User.findByIdAndUpdate(userId, { role: "admin" }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User promoted to admin", user });
  } catch (error) {
    console.error("Admin promote error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ===== Quản lý bài đăng =====
exports.getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "pending" })
      .populate("userId", "fullName email phoneNumber avatar")
      .sort({ createdAt: -1 });
    return res.json({ properties });
  } catch (error) {
    console.error("Get pending properties error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.approveProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndUpdate(id, { status: "approved" }, { new: true });
    if (!property) return res.status(404).json({ message: "Property not found" });
    return res.json({ success: true, property });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.toggleHideProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    property.status = property.status === "hidden" ? "approved" : "hidden";
    await property.save();
    return res.json({ success: true, property });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ===== Thống kê =====
exports.getStatsByArea = async (req, res) => {
  try {
    const stats = await Property.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$location.province", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    return res.json({ stats });
  } catch (error) {
    console.error("Stats by area error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ===== Quản lý người dùng (khóa/mở) =====
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

// ===== Sửa thông tin người dùng =====
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber } = req.body;
    console.log("Updating user:", id, fullName, phoneNumber);
    const user = await User.findByIdAndUpdate(id, { fullName, phoneNumber }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("Updated user:", user);
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ===== Xóa người dùng (tùy chọn) =====
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