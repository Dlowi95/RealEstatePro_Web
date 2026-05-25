const express = require("express");
const {
  getUsers,
  getStats,
  promoteToAdmin,
  getPendingProperties,
  getHiddenProperties,
  getAllProperties,
  approveProperty,
  toggleHideProperty,
  getStatsByArea,
  toggleBlockUser,
  updateUser,
  deleteUser,
  getCurrentApprovedProperties

} = require("../controllers/adminController");



const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/users", getUsers);
router.get("/stats", getStats);
router.post("/promote", promoteToAdmin);
router.get("/properties/pending", getPendingProperties);
<<<<<<< Updated upstream
router.get("/properties/current", getCurrentApprovedProperties);


=======
router.get("/properties/hidden", getHiddenProperties);
router.get("/properties/all", getAllProperties);
>>>>>>> Stashed changes
router.put("/properties/:id/approve", approveProperty);

router.put("/properties/:id/toggle-hide", toggleHideProperty);
router.get("/stats/area", getStatsByArea);
router.put("/users/:id/block", toggleBlockUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;