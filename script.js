const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const opn = require('opn');

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'User',
  password: 'Hinduja@123',
  database: 'internship_project'
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected');
});

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

// Set up the view engine and specify the 'views' directory
app.set('views', path.join(__dirname, 'views')); // Set the absolute path to the 'views' folder
app.set('view engine', 'ejs');

// Set up your routes
app.get('/', (req, res) => {
    // Retrieve data from the database
    db.query('SELECT * FROM internship_project.users', (err, results) => {
        if (err){
          console.log(err);
        }
        res.render('index.ejs', { data: results });
        //console.log(results);
    });
});

app.post('/add', (req, res) => {
    const { name, email, age, dob } = req.body;

    // Validation
    if (!name || !email || !age || !dob) {
      res.status(400).send('All fields are required');
      return;
    }

    // Age must be a positive integer
    const ageInt = parseInt(age);
    if (isNaN(ageInt) || ageInt <= 0) {
      res.status(400).send('Age must be a positive integer');
      return;
    }

    // Insert data into the MySQL database
    const sql = 'INSERT INTO users (name, email, age, dob) VALUES (?, ?, ?, ?)';
    const values = [name, email, age, dob];
    
    db.query(sql, values, (err, result) => {
        if (err) {
          // Handle error
          console.error('Error inserting data:', err);
          res.send('<script>alert("Error inserting data"); window.location="/";</script>');
      } else {
          // Data inserted successfully
          console.log('Data inserted successfully.');
          // Show a success alert and redirect
          res.send('<script>alert("Data inserted successfully"); window.location="/";</script>');
      }
    });

    
});

// Set up the view engine (EJS)
app.set('view engine', 'ejs');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    opn('http://localhost:3000');
});

