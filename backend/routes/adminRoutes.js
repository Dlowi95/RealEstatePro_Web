const express = require("express");
const { getUsers, getStats, promoteToAdmin } = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireAdmin);
router.get("/users", getUsers);
router.get("/stats", getStats);
router.post("/promote", promoteToAdmin);

module.exports = router;
