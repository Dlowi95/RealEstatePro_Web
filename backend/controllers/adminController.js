const User = require("../models/User");

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
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User promoted to admin", user });
  } catch (error) {
    console.error("Admin promote error:", error);
    return res.status(500).json({ message: error.message });
  }
};
