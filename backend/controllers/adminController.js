const User = require("../models/User");
const Property = require("../models/Property");

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
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const user = await User.findByIdAndUpdate(userId, { role: "admin" }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User promoted to admin", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "pending" }).sort({ createdAt: -1 }).lean();
    
    const populatedProperties = await Promise.all(properties.map(async (prop) => {
      const user = await User.findOne({ clerkId: prop.userId }).select("fullName email avatar");
      return { ...prop, user: user || prop.userId };
    }));

    return res.json({ properties: populatedProperties });
  } catch (error) {
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

exports.getStatsByArea = async (req, res) => {
  try {
    const stats = await Property.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$location.province", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
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
    const user = await User.findByIdAndUpdate(id, { fullName, phoneNumber }, { new: true });
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