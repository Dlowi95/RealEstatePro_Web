const express = require("express");
const { registerUser, syncUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/sync", syncUser);

module.exports = router;