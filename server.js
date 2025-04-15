const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');  // or your preferred DB library

const app = express();

// Use body-parser middleware to handle form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure your MySQL connection (adjust parameters as needed)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'YourPassword',
  database: 'contactdb'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error("DB Connection Error:", err);
  } else {
    console.log("Connected to the database.");
  }
});

// Serve the contact form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/contact.html');
});

// Handle form submission
app.post('/submit-contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  // Insert the contact into the database
  const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send('Error saving data to the database.');
    }
    res.send(`Thank you, ${name}! Your message has been received.`);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
