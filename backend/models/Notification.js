const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.index(
  { createdAt: -1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 },
); // Automatically delete notifications after 30 days

module.exports = mongoose.model("Notification", notificationSchema);
