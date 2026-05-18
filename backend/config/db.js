const dns = require("dns");
const mongoose = require("mongoose");

const connectDB = async () => {

  try {

    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "RealEstatePro",
    });

    console.log("MongoDB Connected");

  } catch (error) {

    console.error("MongoDB connection error:", error);

    process.exit(1);
  }
};

module.exports = connectDB;