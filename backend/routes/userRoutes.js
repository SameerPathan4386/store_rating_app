const express = require("express");

const router = express.Router();

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    changePassword
} = require("../controllers/userController");

router.put(
    "/password",
    authenticateToken,
    changePassword
);

module.exports = router;