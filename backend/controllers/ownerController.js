const pool = require("../config/db");

exports.getOwnerDashboard = async (req, res) => {
    try {
        // Get stores owned by the logged in owner
        const storesResult = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.address,
                COALESCE(
                    ROUND(AVG(r.rating), 1),
                    0
                ) AS average_rating
             FROM stores s
             LEFT JOIN ratings r
                ON s.id = r.store_id
             WHERE s.owner_id = $1
             GROUP BY s.id
             ORDER BY s.name ASC`,
            [req.user.id]
        );

        // Get users who rated the owners stores
        const ratersResult = await pool.query(
            `SELECT
                s.id AS store_id,
                s.name AS store_name,
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                r.rating
             FROM stores s
             INNER JOIN ratings r
                ON s.id = r.store_id
             INNER JOIN users u
                ON u.id = r.user_id
             WHERE s.owner_id = $1
             ORDER BY s.name ASC, u.name ASC`,
            [req.user.id]
        );

        res.json({
            stores: storesResult.rows,
            raters: ratersResult.rows
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not get owner dashboard"
        });
    }
};