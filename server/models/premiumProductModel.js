
const pool = require("../database/connection");

exports.getPremiumProductsByType = async (subscriptionType) => { // Corrected function name to reflect intent


    return new Promise((resolve, reject) => {
        pool.query(
           'SELECT * FROM premium_products WHERE subscription_type = ?', [subscriptionType],

            (err, result) => {
                if (err) {
                    reject(err);
                } else {

                    console.log("result from the getPremiumProducts ", result);
                    resolve(result);
                }
            }
        );
    });
};