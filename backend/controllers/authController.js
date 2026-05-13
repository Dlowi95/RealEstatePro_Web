const User = require("../models/User");
const { verifyToken } = require("@clerk/backend");
const crypto = require("crypto");

// Helper function to encrypt password with MD5
const encryptPasswordMD5 = (password) => {
  return crypto.createHash("md5").update(password).digest("hex");
};

exports.registerUser = async (
  req,
  res
) => {

  try {

    const {
      fullName,
      email,
      password,
      phoneNumber,
      avatar
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });
    }

    const encryptedPassword = password ? encryptPasswordMD5(password) : "";

    const user = await User.create({

      fullName,
      email,
      password: encryptedPassword,
      phoneNumber,
      avatar

    });

    res.status(201).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

exports.syncUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    // Verify Clerk token
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    const clerkUserId = decoded.sub;
    const bodyEmail = req.body.email || "";
    const bodyFullName = req.body.fullName || "";
    const bodyAvatar = req.body.avatar || "";

    const email = decoded.email_addresses?.[0]?.email_address || decoded.email_address || bodyEmail;
    const fullName = decoded.full_name || `${decoded.first_name || ""} ${decoded.last_name || ""}`.trim() || decoded.name || bodyFullName || "";
    const avatar = decoded.image_url || bodyAvatar || "";

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    // Find or create user in MongoDB by clerkId first, then by email
    let user = null;

    if (clerkUserId) {
      user = await User.findOne({ clerkId: clerkUserId });
    }

    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      user = await User.create({
        fullName,
        email,
        avatar,
        clerkId: clerkUserId
      });
    } else {
      // Update existing user with latest Clerk data, preserve role
      user = await User.findByIdAndUpdate(
        user._id,
        {
          fullName,
          email,
          avatar,
          clerkId: clerkUserId
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Sync error:", error);
    res.status(401).json({
      message: "Invalid token"
    });
  }
};