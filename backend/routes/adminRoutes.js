const express = require("express");

const router = express.Router();

const authenticateToken =
    require("../middleware/authMiddleware");

const checkRole =
    require("../middleware/roleMiddleware");

const {
    getDashboardStats,
    getUsers,
    getUserById,
    createUser,
    getStoreOwners,
    getAdminStores
} = require("../controllers/adminController");


// all routes below require Admin
router.use(
    authenticateToken,
    checkRole("admin")
);


// dashboard statistics
router.get("/dashboard", getDashboardStats);


// get all users
router.get("/users", getUsers);


// get one user
router.get("/users/:id", getUserById);


// create user/admin/owner
router.post("/users", createUser);

router.get("/store-owners", getStoreOwners);

router.get("/stores", getAdminStores);

module.exports = router;