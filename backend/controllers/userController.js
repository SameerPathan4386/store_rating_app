const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
    return regex.test(password);
};

exports.changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        // Check required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        // Validate new password
        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message:
                    "New password must be 8-16 characters and contain at least one uppercase letter and one special character"
            });
        }

        // Get the logged-in user's password
        const result = await pool.query(
            "SELECT password FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result.rows[0];

        // Check current password
        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Update password
        await pool.query(
            `UPDATE users
             SET password = $1
             WHERE id = $2`,
            [
                hashedPassword,
                req.user.id
            ]
        );

        res.json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not change password"
        });
    }
};