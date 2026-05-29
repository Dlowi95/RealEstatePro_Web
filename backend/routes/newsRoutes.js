const express = require("express");
const { getLatestRealEstateNews } = require("../controllers/newsController");

const router = express.Router();

router.get("/", getLatestRealEstateNews);

module.exports = router;