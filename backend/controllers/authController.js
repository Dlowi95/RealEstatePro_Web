const User = require("../models/User");
const { verifyToken } = require("@clerk/backend");
const crypto = require("crypto");

// Helper function to encrypt password with MD5
const encryptPasswordMD5 = (password) => {
  return crypto.createHash("md5").update(password).digest("hex");
};

const formatClerkError = (error) => {
  const firstError = Array.isArray(error?.errors) ? error.errors[0] : null;

  return {
    message: firstError?.message || error?.message || "Unauthorized",
    reason: firstError?.reason || error?.reason || "unknown_reason",
    status: error?.status || error?.response?.status || 401,
  };
};

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, avatar } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const encryptedPassword = password ? encryptPasswordMD5(password) : "";

    const user = await User.create({
      fullName,
      email,
      password: encryptedPassword,
      phoneNumber,
      avatar,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.syncUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const clerkUserId = decoded.sub;
    const email =
      decoded.email_addresses?.[0]?.email_address ||
      decoded.email_address ||
      req.body.email ||
      "";
    const fullName =
      decoded.full_name ||
      `${decoded.first_name || ""} ${decoded.last_name || ""}`.trim() ||
      decoded.name ||
      req.body.fullName ||
      "";
    const avatar = decoded.image_url || req.body.avatar || "";

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = null;
    if (clerkUserId) {
      user = await User.findOne({ clerkId: clerkUserId });
    }
    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      // Tạo mới user, lấy fullName từ Clerk
      user = await User.create({
        fullName,
        email,
        avatar,
        clerkId: clerkUserId,
        phoneNumber: "",
        role: "user",
      });
    } else {
      // Cập nhật các trường, nhưng giữ nguyên fullName và phoneNumber đã có
      user.avatar = avatar;
      user.email = email;
      if (clerkUserId) user.clerkId = clerkUserId;
      // Chỉ cập nhật fullName nếu user chưa có tên
      if (!user.fullName && fullName) {
        user.fullName = fullName;
      }
      await user.save();
    }

    console.log("[authController.syncUser] matched user:", {
      id: user._id,
      email: user.email,
      role: user.role,
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    const clerkError = formatClerkError(error);

    console.error("[authController.syncUser] verification failed:", clerkError);
    return res.status(clerkError.status).json({
      message: "Unauthorized",
      reason: clerkError.reason,
      detail: clerkError.message,
    });
  }
};
