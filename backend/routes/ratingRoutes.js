const express = require("express");

const router = express.Router();

const authenticateToken =
    require("../middleware/authMiddleware");

const checkRole =
    require("../middleware/roleMiddleware");

const {
    addRating,
    updateRating
} = require("../controllers/ratingController");

router.post(
    "/",
    authenticateToken,
    checkRole("user"),
    addRating
);

router.put(
    "/:store_id",
    authenticateToken,
    checkRole("user"),
    updateRating
);

module.exports = router;