const pool = require("../config/db");

// ADD RATING
exports.addRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;

        // Check required fields
        if (!store_id || rating === undefined) {
            return res.status(400).json({
                message: "Store ID and rating are required"
            });
        }

        // Rating must be between 1 and 5
        // if (rating < 1 || rating > 5) {
        if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
            return res.status(400).json({
                message: "Rating must be a number between 1 and 5"
            });
        }

        // Check if store exists
        const storeResult = await pool.query(
            "SELECT id FROM stores WHERE id = $1",
            [store_id]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // Check if user has already rated this store
        const existingRating = await pool.query(
            `SELECT id
             FROM ratings
             WHERE user_id = $1
             AND store_id = $2`,
            [req.user.id, store_id]
        );

        if (existingRating.rows.length > 0) {
            return res.status(400).json({
                message: "You have already rated this store"
            });
        }

        // Insert rating
        const result = await pool.query(
            `INSERT INTO ratings
            (user_id, store_id, rating)
            VALUES ($1, $2, $3)
            RETURNING id, user_id, store_id, rating`,
            [
                req.user.id,
                store_id,
                rating
            ]
        );

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        // PostgreSQL duplicate constraint
        if (error.code === "23505") {
            return res.status(400).json({
                message: "You have already rated this store"
            });
        }

        res.status(500).json({
            message: "Could not submit rating"
        });
    }
};

// UPDATE RATING
exports.updateRating = async (req, res) => {
    try {
        const { store_id } = req.params;
        const { rating } = req.body;

        // Check rating
        if (rating === undefined) {
            return res.status(400).json({
                message: "Rating is required"
            });
        }

        // if (rating < 1 || rating > 5) {
        if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
            return res.status(400).json({
                message: "Rating must be a number between 1 and 5"
            });
        }

        // Update only the logged-in user's rating
        const result = await pool.query(
            `UPDATE ratings
             SET rating = $1
             WHERE user_id = $2
             AND store_id = $3
             RETURNING id, user_id, store_id, rating`,
            [
                rating,
                req.user.id,
                store_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message:
                    "You have not submitted a rating for this store"
            });
        }

        res.json({
            message: "Rating updated successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not update rating"
        });
    }
};