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
        pool.query(
            "UPDATE subscriptions SET next_order_date = ?, status = ? WHERE id = ?",
            [nextOrderDate, status, subscriptionId],

            (err, result) => {
                if (err) {
                    reject(err);
                } else {

                    console.log("result from update  query  === ", result);
                    resolve(result);
                }
            }
        );
    });
};
