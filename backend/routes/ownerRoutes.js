const express = require("express");

const router = express.Router();

const authenticateToken =
    require("../middleware/authMiddleware");

const checkRole =
    require("../middleware/roleMiddleware");

const {
    getOwnerDashboard
} = require("../controllers/ownerController");

router.get(
    "/dashboard",
    authenticateToken,
    checkRole("owner"),
    getOwnerDashboard
);

module.exports = router;