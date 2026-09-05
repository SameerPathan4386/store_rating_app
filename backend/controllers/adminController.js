const pool = require("../config/db");

// bhai admin dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const usersResult = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        const storesResult = await pool.query(
            "SELECT COUNT(*) FROM stores"
        );

        const ratingsResult = await pool.query(
            "SELECT COUNT(*) FROM ratings"
        );

        res.json({
            totalUsers: Number(usersResult.rows[0].count),
            totalStores: Number(storesResult.rows[0].count),
            totalRatings: Number(ratingsResult.rows[0].count)
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not get dashboard statistics"
        });
    }
};


// bhai get all users
exports.getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, address, role
             FROM users
             ORDER BY name ASC`
        );

        res.json(result.rows);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not get users"
        });
    }
};

// bhai get one user by id

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT id, name, email, address, role
             FROM users
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result.rows[0];

        // If the user is a store owner, find the store and its rating
        if (user.role === "owner") {

            const storeResult = await pool.query(
                `SELECT
                    s.id,
                    s.name,
                    s.email,
                    s.address,
                    COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
                 FROM stores s
                 LEFT JOIN ratings r
                 ON s.id = r.store_id
                 WHERE s.owner_id = $1
                 GROUP BY s.id`,
                [id]
            );

            user.stores = storeResult.rows;
        }

        res.json(user);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not get user details"
        });
    }
};

// create user / admin / owner

exports.createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            address,
            role
        } = req.body;

        // Required fields
        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Role validation
        if (!["user", "admin", "owner"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        // Name validation
        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message: "Name must be between 20 and 60 characters"
            });
        }

        // Address validation
        if (address.length > 400) {
            return res.status(400).json({
                message: "Address cannot exceed 400 characters"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        // Password validation
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be 8-16 characters and contain one uppercase letter and one special character"
            });
        }

        // Check duplicate email
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const bcrypt = require("bcryptjs");

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const result = await pool.query(
            `INSERT INTO users
            (name, email, password, address, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, address, role`,
            [
                name,
                email,
                hashedPassword,
                address,
                role
            ]
        );

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not create user"
        });
    }
};

exports.getStoreOwners = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email
             FROM users
             WHERE role = 'owner'
             ORDER BY name ASC`
        );

        res.json(result.rows);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not get store owners"
        });
    }
};
exports.getAdminStores = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                u.name AS owner_name,
                u.email AS owner_email,
                COALESCE(
                    ROUND(AVG(r.rating), 1),
                    0
                ) AS rating
             FROM stores s
             LEFT JOIN users u
                ON s.owner_id = u.id
             LEFT JOIN ratings r
                ON s.id = r.store_id
             GROUP BY s.id, u.name, u.email
             ORDER BY s.name ASC`
        );

        res.json(result.rows);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not get stores"
        });
    }
};