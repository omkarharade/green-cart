
const pool = require("../database/connection");


// SELECT * FROM product WHERE productId IN (5, 16, 11, 4, 22);


exports.getPremiumProductsByType = async (subscriptionType) => {
    return new Promise((resolve, reject) => {
        if (subscriptionType === "Basic Box") {

            const productIds = [6, 19, 11, 4, 22]
            
            const placeholders = productIds.map(() => '?').join(','); // Create placeholders for the IN clause
            const query = `SELECT * FROM product WHERE productId IN (${placeholders});`; // Template literal for dynamic query

            pool.query(query, productIds, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });

        } else {
            pool.query(
                "SELECT * FROM premium_products WHERE subscription_type = ?",
                [subscriptionType],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        }
    });
};