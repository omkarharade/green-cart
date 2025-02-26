const mysql2 = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Load environment variables

let connectionParams;

// Toggle between localhost and server configurations
const useLocalhost = process.env.USE_LOCALHOST === "true";

if (useLocalhost) {
    console.log("Inside local");
    connectionParams = {
        user: "root",
        host: "localhost",
        password: "Omkar@1301",
        database: "store_db",
        multipleStatements: true, // Allows executing multiple SQL statements
    };
} else {
    connectionParams = {
        user: process.env.DB_SERVER_USER,
        host: process.env.DB_SERVER_HOST,
        password: process.env.DB_SERVER_PASSWORD,
        database: process.env.DB_SERVER_DATABASE,
        multipleStatements: true,
    };
}

const pool = mysql2.createConnection(connectionParams);

// Connect to the database
pool.connect((err) => {
    if (err) {
        console.log("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ DB Connection Done");
        executeSQLFile(); // Run SQL script after connection
    }
});

// Function to execute the SQL file
function executeSQLFile() {
    const sqlFilePath = path.join(__dirname, "createTables.sql");

    // Read the SQL file
    fs.readFile(sqlFilePath, "utf-8", (err, sql) => {
        if (err) {
            console.log("❌ Error reading SQL file:", err);
            return;
        }

        // Execute the SQL queries
        pool.query(sql, (err, results) => {
            if (err) {
                console.log("❌ Error executing SQL file:", err);
            } else {
                console.log("✅ Tables checked/created successfully!");
            }
        });
    });
}

// Export the database pool
module.exports = pool;
