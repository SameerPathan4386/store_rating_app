const express = require("express");

const router = express.Router();

const authenticateToken =
    require("../middleware/authMiddleware");

const checkRole =
    require("../middleware/roleMiddleware");

const {
    getStores,
    createStore
} = require("../controllers/storeController");

// Get all stores
router.get(
    "/",
    authenticateToken,
    getStores
);

// Create a store Only Admin can access this
router.post(
    "/",
    authenticateToken,
    checkRole("admin"),
    createStore
);

module.exports = router;