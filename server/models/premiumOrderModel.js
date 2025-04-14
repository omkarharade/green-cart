const pool = require("../database/connection");

exports.getAllOrders = () => {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT O.orderId,  U.fname, U.lname, O.createdDate, O.totalPrice " +
            "FROM premiumOrders O INNER JOIN users U ON O.userId = U.userId;",
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};


// server/models/premiumOrderModel.js
exports.getOrderById = (orderId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT U.fname, U.lname, O.totalPrice, U.createdDate, O.address, S.plan_name AS subscriptionType  -- Retrieve plan_name as subscriptionType
             FROM premiumOrders O 
             INNER JOIN users U ON O.userId = U.userId  
             INNER JOIN subscriptions S ON O.subscriptionId = S.id -- Join with subscriptions table using subscriptionId (adapt if the column name is different)
             WHERE O.orderId = ?;`, // Assuming 'id' is the primary key in subscriptions
            [orderId],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};


exports.getProductsByOrder = (orderId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT P2.productId, P2.name, P2.imageURL, P.quantity, P.totalPrice " +
            "FROM orders O INNER JOIN productsInOrder P ON O.orderId = P.orderId " +
            "INNER JOIN product P2 ON P.productId = P2.productId " +
            "WHERE O.orderId = ?;",
            [orderId],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};


exports.createPremiumOrder = (userId, address, totalPrice, subscriptionId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO premiumOrders (userId, address, totalPrice, subscriptionId) 
                     VALUES (?, ?, ?, ?);`;
      pool.query(
        query,
        [userId, address, totalPrice, subscriptionId],
        (err, result) => {
            if (err) {
                reject(err);
                return; // Add return statement here to prevent further execution
            }
            // Retrieve the newly created order
            pool.query(
                'SELECT * FROM premiumOrders WHERE orderId = ?', // Retrieve the order by ID
                [result.insertId], // Use the inserted ID
                (err, orderResult) => {
                    if (err) {
                        reject(err); // Reject if there's an error retrieving the data
                    } else {
                        resolve(orderResult[0]); // Resolve with the created order data (first element of array since ID is unique)
                    }
                }
            );
        }
      );
    });
};


