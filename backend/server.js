require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db.js");
const authRoutes = require("./routes/authRoutes");

const ownerRoutes = require("./routes/ownerRoutes");

const storeRoutes = require("./routes/storeRoutes");

const authenticateToken = require("./middleware/authMiddleware");
const checkRole = require("./middleware/roleMiddleware");

const ratingRoutes = require("./routes/ratingRoutes");

const adminRoutes = require("./routes/adminRoutes");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Store Rating API is running");
});

// Authentication routes
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/ratings", ratingRoutes);

app.use("/api/stores", storeRoutes);

app.use("/api/owner", ownerRoutes);

app.use("/api/users", userRoutes);

// app.get(
//     "/api/test",
//     authenticateToken,
//     (req, res) => {
//         res.json({
//             message: "You accessed a protected route",
//             user: req.user
//         });
//     }
// );

// app.get(
//     "/api/admin-test",
//     authenticateToken,
//     checkRole("admin"),
//     (req, res) => {
//         res.json({
//             message: "You are an admin",
//             user: req.user
//         });
//     }
// );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
