const User = require("../models/User");
const { verifyToken } = require("@clerk/backend");

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

    const user = await User.create({

      fullName,
      email,
      password,
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
    const email = decoded.email_addresses?.[0]?.email_address;
    const firstName = decoded.first_name || "";
    const lastName = decoded.last_name || "";
    const avatar = decoded.image_url || "";

    // Find or create user in MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        avatar,
        clerkId: clerkUserId
      });
    } else {
      // Update existing user with latest Clerk data
      user = await User.findByIdAndUpdate(
        user._id,
        {
          fullName: `${firstName} ${lastName}`.trim(),
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