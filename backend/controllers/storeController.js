const pool = require("../config/db");

// Get all stores
exports.getStores = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,

                COALESCE(
                    ROUND(AVG(allRatings.rating), 1),
                    0
                ) AS rating,

                MAX(userRating.rating) AS user_rating

             FROM stores s

             LEFT JOIN ratings allRatings
                ON s.id = allRatings.store_id

             LEFT JOIN ratings userRating
                ON s.id = userRating.store_id
                AND userRating.user_id = $1

             GROUP BY s.id

             ORDER BY s.name ASC`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not get stores"
        });
    }
};


// Create a store
exports.createStore = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            owner_id
        } = req.body;

        // Check required fields
        if (!name || !email || !address || !owner_id) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate store name
        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message:
                    "Store name must be between 20 and 60 characters"
            });
        }

        // Validate address
        if (address.length > 400) {
            return res.status(400).json({
                message:
                    "Address cannot exceed 400 characters"
            });
        }

        // Validate email
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        // Check whether selected user is an owner
        const ownerResult = await pool.query(
            `SELECT id
             FROM users
             WHERE id = $1
             AND role = 'owner'`,
            [owner_id]
        );

        if (ownerResult.rows.length === 0) {
            return res.status(400).json({
                message:
                    "Selected user is not a valid store owner"
            });
        }

        // Create store
        const result = await pool.query(
            `INSERT INTO stores
            (name, email, address, owner_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, address, owner_id`,
            [
                name,
                email,
                address,
                owner_id
            ]
        );

        res.status(201).json({
            message: "Store created successfully",
            store: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        // Duplicate store email
        if (error.code === "23505") {
            return res.status(400).json({
                message:
                    "A store with this email already exists"
            });
        }

        res.status(500).json({
            message: "Could not create store"
        });
    }
};