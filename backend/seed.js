require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("./config/db");

const seedDatabase = async () => {
    try {
        // Hash passwords
        const adminPassword = await bcrypt.hash("Admin@123", 10);
        const ownerPassword = await bcrypt.hash("Owner@123", 10);

        // Create Admin
        const adminResult = await pool.query(
            `INSERT INTO users
            (name, email, password, address, role)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO NOTHING
            RETURNING id`,
            [
                "System Administrator Account",
                "admin@example.com",
                adminPassword,
                "Admin Office Maharashtra India",
                "admin"
            ]
        );

        // Create Store Owner
        const ownerResult = await pool.query(
            `INSERT INTO users
            (name, email, password, address, role)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO NOTHING
            RETURNING id`,
            [
                "Store Owner Account Roxiler",
                "owner@example.com",
                ownerPassword,
                "Store Owner Office Maharashtra India",
                "owner"
            ]
        );

        // Get owner ID
        let ownerId;

        if (ownerResult.rows.length > 0) {
            ownerId = ownerResult.rows[0].id;
        } else {
            const existingOwner = await pool.query(
                "SELECT id FROM users WHERE email = $1",
                ["owner@example.com"]
            );

            ownerId = existingOwner.rows[0].id;
        }

        // Create Store
        await pool.query(
            `INSERT INTO stores
            (name, email, address, owner_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING`,
            [
                "Roxiler Hardware Store",
                "store@example.com",
                "Main Market Maharashtra India",
                ownerId
            ]
        );

        console.log("Seed data created successfully.");

        console.log("");
        console.log("Admin login:");
        console.log("Email: admin@example.com");
        console.log("Password: Admin@123");

        console.log("");
        console.log("Owner login:");
        console.log("Email: owner@example.com");
        console.log("Password: Owner@123");

        process.exit(0);

    } catch (error) {
        console.log("Seed error:");
        console.log(error);

        process.exit(1);
    }
};

seedDatabase();