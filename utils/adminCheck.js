// Import the MySQL connection
const {conn} = require('./db.js'); // Assuming you've defined the MySQL connection in a separate file




// Function to check if a user exists
const checkUserExists = (username, callback) => {
    let sql = "SELECT * FROM login WHERE username = ?";
    conn.query(sql, [username], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results.length > 0);
    });
};

// Function to verify the password
const verifyPassword = (username, password, callback) => {
    let sql = "SELECT * FROM login WHERE username = ?";
    conn.query(sql, [username], (err, results) => {
        if (err) {
            return callback(err);
        }
        if (results.length === 0) {
            return callback(null, false); // User not found
        }
        const user = results[0];
        callback(null, user.password === password);
    });
};

module.exports = {
    checkUserExists,
    verifyPassword
};
