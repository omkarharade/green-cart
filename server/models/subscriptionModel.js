const pool = require("../database/connection");

// Function to create a new subscription
exports.createSubscription = async (
	userId,
	planName,
	address,
	endDate,
	nextOrderDate,
	discount
) => {

	return new Promise((resolve, reject) => {
		pool.query(
			"INSERT INTO subscriptions (user_id, plan_name, end_date, next_order_date, discount, delivery_address) VALUES (?, ?, ?, ?, ?, ?)",
			[userId, planName, endDate, nextOrderDate, discount, address],
			(err, result) => {
				if (err) {
					reject(err);
				} else {
					const insertId = result.insertId;
					pool.query(
						"SELECT * FROM subscriptions WHERE id = ?",
						[insertId],
						(err, insertedData) => {
							if (err) {
								reject(err);
							} else {
								resolve(insertedData[0]); // Resolve with the inserted row data
							}
						}
					);
				}
			}
		);
	});
};

exports.updateSubscription = async (subscriptionId, nextOrderDate, status) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE subscriptions SET next_order_date = ?, status = ? WHERE id = ?";
        pool.query(
            query,
            [nextOrderDate, status, subscriptionId],
            (err, result) => {
                if (err) {
                    reject(err);
                    return; // Prevent further execution on error
                }

                // Retrieve the updated subscription data
                pool.query(
                    "SELECT * FROM subscriptions WHERE id = ?",
                    [subscriptionId],
                    (err, updatedSubscriptionResult) => {
                        if (err) {
                            reject(err); // Reject if retrieval fails
                        } else {
                            resolve(updatedSubscriptionResult[0]); // Resolve with the updated data
                        }
                    }
                );
            }
        );
    });
};


exports.getDetailsByType = async (userId, planName) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM subscriptions WHERE user_id = ? AND plan_name = ? AND status = ?"; // Parameterized query
        pool.query(query, [userId, planName, "active"], (err, result) => {
            if (err) {
                reject(err); 
                return; 
            }

            if (result.length === 0) { // Check if no subscription is found
                reject({ message: "Subscription not found.", data: [] }); 
                return; 
            }

            resolve({
				message : "Subscription found", data : [result[0]]}); // Resolve with the first element of result (the subscription details)
        });
    });
};


exports.cancelSubscriptionByType = async (userId, planName) => {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM subscriptions WHERE user_id = ? AND plan_name = ?"; // Use parameterized query for security
        pool.query(query, [userId, planName], (err, result) => {
            if (err) {
                reject(err); // Reject the promise if there's a database error
                return; // Important: stop further execution
            }

			if (result.affectedRows === 0) {
				reject({ message: "Subscription not found." }); // Reject if no rows are affected (subscription not found)
				return; // Important: Stop further execution
			}

            resolve(result); // Resolve with the result object which contains affectedRows etc, indicating successful deletion

        });
    });
};
