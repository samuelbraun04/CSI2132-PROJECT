const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dbPath = path.resolve(__dirname, 'db/hotel_database.db');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { initTables } = require('./db/init_db');

const app = express();
const port = 3000;

// Use middlewares
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  console.log(dbPath);
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the hotel management database.');
  }
});

initTables((db) => {
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Hotel Management System API!' });
  });
  
  // SPECIALIZED CRUD

  // room availability to do aggregate query
  app.get('/hotels/room-availability', (req, res) => {
    const sql = `
      SELECT h.name, COUNT(r.roomNumber) AS availableRooms
      FROM Hotel h
      JOIN Room r ON h.id = r.hotelId
      WHERE r.status = 'Available'
      GROUP BY h.name
    `;
    db.all(sql, [], (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows);
    });
  });
  
  // get hotels with more than 3 rooms booked (popular) to do nested

  app.get('/hotels/popular', (req, res) => {
    const sql = `
      SELECT h.name, COUNT(b.id) AS bookedRooms
      FROM Hotel h
      JOIN Room r ON h.id = r.hotelId
      JOIN Books b ON r.roomNumber = b.roomNumber AND r.hotelId = b.hotelID
      WHERE b.startDate <= date('now') AND b.endDate >= date('now')
      GROUP BY h.name
      HAVING bookedRooms > 10
    `;
    db.all(sql, [], (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows);
    });
  });


  // Create a HotelChain
  app.post('/hotel-chains', (req, res) => {
    const { address, numberOfHotels, emailAddress, phoneNumber } = req.body;
    const sql = `INSERT INTO HotelChain (address, numberOfHotels, emailAddress, phoneNumber) VALUES (?, ?, ?, ?)`;
    db.run(sql, [address, numberOfHotels, emailAddress, phoneNumber], function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.status(201).json({ id: this.lastID });
    });
  });

  // Get all HotelChains
  app.get('/hotel-chains', (req, res) => {
    db.all('SELECT * FROM HotelChain', [], (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows);
    });
  });

  // Get a single HotelChain by ID
  app.get('/hotel-chains/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM HotelChain WHERE id = ?', [id], (err, row) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(row);
    });
  });

  // Update a HotelChain
  app.put('/hotel-chains/:id', (req, res) => {
    const { address, numberOfHotels, emailAddress, phoneNumber } = req.body;
    const { id } = req.params;
    const sql = `UPDATE HotelChain SET address = ?, numberOfHotels = ?, emailAddress = ?, phoneNumber = ? WHERE id = ?`;
    db.run(sql, [address, numberOfHotels, emailAddress, phoneNumber, id], function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ updated: this.changes });
    });
  });

  // Delete a HotelChain
  app.delete('/hotel-chains/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM HotelChain WHERE id = ?', [id], function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ deleted: this.changes });
    });
  });

  // Create a Hotel
app.post('/hotels', (req, res) => {
  const { hotelChainId, name, stars, address, numberOfRooms, emailAddress, phoneNumber } = req.body;
  const sql = `INSERT INTO Hotel (hotelChainId, name, stars, address, numberOfRooms, emailAddress, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [hotelChainId, name, stars, address, numberOfRooms, emailAddress, phoneNumber], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json({ id: this.lastID });
  });
});

// Read all Hotels
app.get('/hotels', (req, res) => {
  db.all(`SELECT * FROM Hotel`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Update a Hotel
app.put('/hotels/:id', (req, res) => {
  const { hotelChainId, name, stars, address, numberOfRooms, emailAddress, phoneNumber } = req.body;
  const { id } = req.params;
  const sql = `UPDATE Hotel SET hotelChainId = ?, name = ?, stars = ?, address = ?, numberOfRooms = ?, emailAddress = ?, phoneNumber = ? WHERE id = ?`;
  db.run(sql, [hotelChainId, name, stars, address, numberOfRooms, emailAddress, phoneNumber, id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ updated: this.changes });
  });
});

// Delete a Hotel
app.delete('/hotels/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Hotel WHERE id = ?`, [id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

app.post('/rooms', (req, res) => {
  const { hotelId, roomNumber, price, capacity, status, view, extendable, amenities, damages } = req.body;
  const sql = `INSERT INTO Room (hotelId, roomNumber, price, capacity, status, view, extendable, amenities, damages) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [hotelId, roomNumber, price, capacity, status, view, extendable, amenities, damages], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json({ id: this.lastID });
  });
});


app.get('/rooms', (req, res) => {
  db.all(`SELECT * FROM Room`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Read a single room by roomNumber and hotelId (since roomNumber alone is not unique across hotels)
app.get('/rooms/:hotelId/:roomNumber', (req, res) => {
  const { hotelId, roomNumber } = req.params;
  db.get(`SELECT * FROM Room WHERE hotelId = ? AND roomNumber = ?`, [hotelId, roomNumber], (err, row) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(row);
  });
});

app.put('/rooms/:hotelId/:roomNumber', (req, res) => {
  const { hotelId, roomNumber } = req.params;
  const { price, capacity, status, view, extendable, amenities, damages } = req.body;
  const sql = `UPDATE Room SET price = ?, capacity = ?, status = ?, view = ?, extendable = ?, amenities = ?, damages = ? WHERE hotelId = ? AND roomNumber = ?`;
  db.run(sql, [price, capacity, status, view, extendable, amenities, damages, hotelId, roomNumber], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ updated: this.changes });
  });
});

app.delete('/rooms/:hotelId/:roomNumber', (req, res) => {
  const { hotelId, roomNumber } = req.params;
  db.run(`DELETE FROM Room WHERE hotelId = ? AND roomNumber = ?`, [hotelId, roomNumber], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});


  // Create a Person
app.post('/persons', (req, res) => {
  const { firstName, lastName, address } = req.body;
  db.run(`INSERT INTO Person (firstName, lastName, address) VALUES (?, ?, ?)`, [firstName, lastName, address], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json({ id: this.lastID });
  });
});

// Read all Persons
app.get('/persons', (req, res) => {
  db.all(`SELECT * FROM Person`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Update a Person
app.put('/persons/:id', (req, res) => {
  const { firstName, lastName, address } = req.body;
  const { id } = req.params;
  db.run(`UPDATE Person SET firstName = ?, lastName = ?, address = ? WHERE id = ?`, [firstName, lastName, address, id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ updated: this.changes });
  });
});

// Delete a Person
app.delete('/persons/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Person WHERE id = ?`, [id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

// Create an Employee
app.post('/employees', (req, res) => {
  const { SIN, personID, positions, hotelID } = req.body;
  db.run(`INSERT INTO Employee (SIN, personID, positions, hotelID) VALUES (?, ?, ?, ?)`, [SIN, personID, positions, hotelID], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json({ id: this.lastID });
  });
});

// Read all Employees
app.get('/employees', (req, res) => {
  db.all(`SELECT * FROM Employee`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Update an Employee
app.put('/employees/:SIN', (req, res) => {
  const { personID, positions, hotelID } = req.body;
  const { SIN } = req.params;
  db.run(`UPDATE Employee SET personID = ?, positions = ?, hotelID = ? WHERE SIN = ?`, [personID, positions, hotelID, SIN], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ updated: this.changes });
  });
});

// Delete an Employee
app.delete('/employees/:SIN', (req, res) => {
  const { SIN } = req.params;
  db.run(`DELETE FROM Employee WHERE SIN = ?`, [SIN], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

// Create a Manager
app.post('/managers', (req, res) => {
  const { personID, employeeSIN, hotelID } = req.body;
  db.run(`INSERT INTO Manager (personID, employeeSIN, hotelID) VALUES (?, ?, ?)`, [personID, employeeSIN, hotelID], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json({ id: this.lastID });
  });
});

// Read all Managers
app.get('/managers', (req, res) => {
  db.all(`SELECT * FROM Manager`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Update a Manager
app.put('/managers/:personID', (req, res) => {
  const { employeeSIN, hotelID } = req.body;
  const { personID } = req.params;
  db.run(`UPDATE Manager SET employeeSIN = ?, hotelID = ? WHERE personID = ?`, [employeeSIN, hotelID, personID], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ updated: this.changes });
  });
});

// Delete a Manager
app.delete('/managers/:personID', (req, res) => {
  const { personID } = req.params;
  db.run(`DELETE FROM Manager WHERE personID = ?`, [personID], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

// Create a Customer
app.post('/customers', (req, res) => {
  const { hotelID, dateOfRegistration, personID, paymentID } = req.body;
  db.run(`INSERT INTO Customer (hotelID, dateOfRegistration, personID, paymentID) VALUES (?, ?, ?, ?)`, [hotelID, dateOfRegistration, personID, paymentID], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json({ id: this.lastID });
  });
});

// Read all Customers
app.get('/customers', (req, res) => {
  db.all(`SELECT * FROM Customer`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Update a Customer
app.put('/customers/:id', (req, res) => {
  const { hotelID, dateOfRegistration, personID, paymentID } = req.body;
  const { id } = req.params;
  db.run(`UPDATE Customer SET hotelID = ?, dateOfRegistration = ?, personID = ?, paymentID = ? WHERE id = ?`, [hotelID, dateOfRegistration, personID, paymentID, id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ updated: this.changes });
  });
});

// Delete a Customer
app.delete('/customers/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Customer WHERE id = ?`, [id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

// Create a Payment
app.post('/payments', (req, res) => {
  const { bookingID, amount, paymentDate, hotelID } = req.body;
  db.run(`INSERT INTO Payment (bookingID, amount, paymentDate, hotelID) VALUES (?, ?, ?, ?)`, [bookingID, amount, paymentDate, hotelID], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json({ id: this.lastID });
  });
});

// Read all Payments
app.get('/payments', (req, res) => {
  db.all(`SELECT * FROM Payment`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Update a Payment
app.put('/payments/:id', (req, res) => {
  const { bookingID, amount, paymentDate, hotelID } = req.body;
  const { id } = req.params;
  db.run(`UPDATE Payment SET bookingID = ?, amount = ?, paymentDate = ?, hotelID = ? WHERE id = ?`, [bookingID, amount, paymentDate, hotelID, id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ updated: this.changes });
  });
});

// Delete a Payment
app.delete('/payments/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Payment WHERE id = ?`, [id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

// Create a Booking
app.post('/books', (req, res) => {
  const { customerID, roomNumber, startDate, endDate } = req.body;
  db.run(`INSERT INTO Books (customerID, roomNumber, startDate, endDate) VALUES (?, ?, ?, ?)`, [customerID, roomNumber, startDate, endDate], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json({ id: this.lastID });
  });
});

// Read all Bookings
app.get('/books', (req, res) => {
  db.all(`SELECT * FROM Books`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Update a Booking
app.put('/books/:id', (req, res) => {
  const { customerID, roomNumber, startDate, endDate } = req.body;
  const { id } = req.params;
  db.run(`UPDATE Books SET customerID = ?, roomNumber = ?, startDate = ?, endDate = ? WHERE id = ?`, [customerID, roomNumber, startDate, endDate, id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ updated: this.changes });
  });
});
  
  // ... include CRUD operations for other tables ...
  
  // Start server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  
})