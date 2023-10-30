const mysql = require('mysql');

// Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});



// View Users
exports.view = (req, res) => {
    let connection; // Declare connection outside the callback
    pool.getConnection((err, con) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.message);
            res.status(500).send('Database connection error');
            return;
        }
        connection = con; // Assign the connection inside the callback
        console.log('Connected as ID ' + connection.threadId);
        // Use the connection
        connection.query('SELECT * FROM user WHERE status = "active"', (queryErr, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!queryErr) {
                let removedUser = req.query.removed;
                res.render('home', { rows, removedUser });
            } else {
                console.error('Error querying the database: ' + queryErr.message);
                res.status(500).send('Database query error');
            }
            console.log('The data from the user table: \n', rows);
        });
    });
};

// Find user by search
exports.find = (req, res) => {
    let connection; // Declare connection outside the callback
    pool.getConnection((err, con) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.message);
            res.status(500).send('Database connection error');
            return;
        }
        connection = con; // Assign the connection inside the callback
        console.log('Connected as ID ' + connection.threadId);

        let searchTerm = req.body.search;

        // Use the connection
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (queryErr, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!queryErr) {
                res.render('home', { rows });
            } else {
                console.error('Error querying the database: ' + queryErr.message);
                res.status(500).send('Database query error');
            }
            console.log('The data from the user table: \n', rows);
        });
    });
}


exports.form = (req, res) => {
    res.render('add-user');
}


// Add new user
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;

    let connection; // Declare connection outside the callback
    pool.getConnection((err, con) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.message);
            res.status(500).send('Database connection error');
            return;
        }
        connection = con; // Assign the connection inside the callback
        console.log('Connected as ID ' + connection.threadId);

        let searchTerm = req.body.search;

        // Use the connection
        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (queryErr, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!queryErr) {
                res.render('add-user', { alert: 'User Added Successfully.' });
            } else {
                console.error('Error querying the database: ' + queryErr.message);
                res.status(500).send('Database query error');
            }
            console.log('The data from the user table: \n', rows);
        });
    });
}


// Edit user
exports.edit = (req, res) => {
    let connection; // Declare connection outside the callback
    pool.getConnection((err, con) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.message);
            res.status(500).send('Database connection error');
            return;
        }
        connection = con; // Assign the connection inside the callback
        console.log('Connected as ID ' + connection.threadId);
        // Use the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (queryErr, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!queryErr) {
                res.render('edit-user', { rows });
            } else {
                console.error('Error querying the database: ' + queryErr.message);
                res.status(500).send('Database query error');
            }
            console.log('The data from the user table: \n', rows);
        });
    });
}


// Update user
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;

    let connection; // Declare connection outside the callback
    pool.getConnection((err, con) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.message);
            res.status(500).send('Database connection error');
            return;
        }
        connection = con; // Assign the connection inside the callback
        console.log('Connected as ID ' + connection.threadId);
        // Use the connection
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (queryErr, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!queryErr) {



                let connection; // Declare connection outside the callback
                pool.getConnection((err, con) => {
                    if (err) {
                        console.error('Error connecting to the database: ' + err.message);
                        res.status(500).send('Database connection error');
                        return;
                    }
                    connection = con; // Assign the connection inside the callback
                    console.log('Connected as ID ' + connection.threadId);
                    // Use the connection
                    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (queryErr, rows) => {
                        // When done with the connection, release it
                        connection.release();
                        if (!queryErr) {
                            res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
                        } else {
                            console.error('Error querying the database: ' + queryErr.message);
                            res.status(500).send('Database query error');
                        }
                        console.log('The data from the user table: \n', rows);
                    });
                });




            } else {
                console.error('Error querying the database: ' + queryErr.message);
                res.status(500).send('Database query error');
            }
            console.log('The data from the user table: \n', rows);
        });
    });
}


// Delete User
exports.delete = (req, res) => {
    // let connection; // Declare connection outside the callback
    // pool.getConnection((err, con) => {
    //     if (err) {
    //         console.error('Error connecting to the database: ' + err.message);
    //         res.status(500).send('Database connection error');
    //         return;
    //     }
    //     connection = con; // Assign the connection inside the callback
    //     console.log('Connected as ID ' + connection.threadId);
    //     // Use the connection
    //     connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (queryErr, rows) => {
    //         // When done with the connection, release it
    //         connection.release();
    //         if (!queryErr) {
    //             res.redirect('/');
    //         } else {
    //             console.error('Error querying the database: ' + queryErr.message);
    //             res.status(500).send('Database query error');
    //         }
    //         console.log('The data from the user table: \n', rows);
    //     });
    // });

    let connection; // Declare connection outside the callback
    pool.getConnection((err, con) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.message);
            res.status(500).send('Database connection error');
            return;
        }
        connection = con; // Assign the connection inside the callback
        console.log('Connected as ID ' + connection.threadId);
        // Use the connection
        connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (queryErr, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!queryErr) {
                let removedUser = encodeURIComponent('USER successefully removed.');
                res.redirect('/?removed=' + removedUser);
            } else {
                console.error('Error querying the database: ' + queryErr.message);
                res.status(500).send('Database query error');
            }
            console.log('The data from the user table: \n', rows);
        });
    });
}


// View Users
exports.viewall = (req, res) => {
    let connection; // Declare connection outside the callback
    pool.getConnection((err, con) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.message);
            res.status(500).send('Database connection error');
            return;
        }
        connection = con; // Assign the connection inside the callback
        console.log('Connected as ID ' + connection.threadId);
        // Use the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (queryErr, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!queryErr) {
                res.render('view-user', { rows });
            } else {
                console.error('Error querying the database: ' + queryErr.message);
                res.status(500).send('Database query error');
            }
            console.log('The data from the user table: \n', rows);
        });
    });
};