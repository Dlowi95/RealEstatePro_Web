const { verifyToken } = require("@clerk/backend");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const clerkId = decoded.sub;
    const email =
      decoded.email_addresses?.[0]?.email_address ||
      decoded.email_address ||
      decoded.email;

    let user = null;
    if (clerkId) {
      user = await User.findOne({ clerkId });
    }

    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
};
