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

  // // room availability to do aggregate query
  // app.get('/hotels/room-availability', (req, res) => {
  //   const sql = `
  //     SELECT h.name, COUNT(r.roomNumber) AS availableRooms
  //     FROM Hotel h
  //     JOIN Room r ON h.id = r.hotelId
  //     WHERE r.status = 'Available'
  //     GROUP BY h.name
  //   `;
  //   db.all(sql, [], (err, rows) => {
  //     if (err) res.status(500).json({ error: err.message });
  //     else res.json(rows);
  //   });
  // });
  
  // get hotels with more than 3 rooms booked (popular) to do nested

  // app.get('/hotels/popular', (req, res) => {
  //   const sql = `
  //     SELECT h.name, COUNT(b.id) AS bookedRooms
  //     FROM Hotel h
  //     JOIN Room r ON h.id = r.hotelId
  //     JOIN Books b ON r.roomNumber = b.roomNumber AND r.hotelId = b.hotelId
  //     WHERE b.startDate <= date('now') AND b.endDate >= date('now')
  //     GROUP BY h.name
  //     HAVING bookedRooms > 10
  //   `;
  //   db.all(sql, [], (err, rows) => {
  //     if (err) res.status(500).json({ error: err.message });
  //     else res.json(rows);
  //   });
  // });

  app.get('/customers/multiple-bookings', (req, res) => {
    const sql = `
        SELECT Customer.id, Customer.firstName, Customer.lastName, COUNT(Books.id) AS NumberOfBookings
        FROM Customer
        JOIN Books ON Customer.id = Books.customerID
        GROUP BY Customer.id
        HAVING NumberOfBookings > 2;
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Read all Hotels
app.get('/hotels', (req, res) => {
  db.all(`SELECT * FROM Hotel`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get('/hotels/rooms-by-city', (req, res) => {
  const sql = `
    SELECT city, SUM(numberOfRooms) AS totalNumberOfRooms
    FROM Hotel
    GROUP BY city
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ city: row.city, totalNumberOfRooms: row.totalNumberOfRooms })));
  });
});

app.get('/hotels/total-capacity', (req, res) => {
  const sql = `
    SELECT h.name AS hotelName, SUM(r.capacity) AS totalCapacity
    FROM Hotel h
    JOIN Room r ON h.id = r.hotelId
    GROUP BY h.id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


 // Create a Hotel
 app.post('/hotels', (req, res) => {
  const { hotelChainId, name, stars, city, address, numberOfRooms, emailAddress, phoneNumber, manager } = req.body;
  const sql = `INSERT INTO Hotel (hotelChainId, name, stars, city, address, numberOfRooms, emailAddress, phoneNumber, manager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [hotelChainId, name, stars, city, address, numberOfRooms, emailAddress, phoneNumber, manager], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json({ id: this.lastID });
  });
});

// Update a Hotel
app.put('/hotels/:id', (req, res) => {
  const { hotelChainId, name, stars, city, address, numberOfRooms, emailAddress, phoneNumber, manager } = req.body;
  const { id } = req.params;
  const sql = `UPDATE Hotel SET hotelChainId = ?, name = ?, stars = ?, city = ?, address = ?, numberOfRooms = ?, emailAddress = ?, phoneNumber = ?, manager = ? WHERE id = ?`;
  db.run(sql, [hotelChainId, name, stars, city, address, numberOfRooms, emailAddress, phoneNumber, manager, id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ updated: this.changes });
  });
});

app.get('/hotels/:id', (req, res) => {
  console.log("Route /hotels/:id accessed");
  const { id } = req.params;
  console.log("Requested ID:", id);
  const sql = 'SELECT * FROM Hotel WHERE id = ?';

  // Assuming db is your SQLite database connection
  db.get(sql, [id], (err, hotel) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
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
  const { SIN, firstName, lastName, personID, positions, hotelId } = req.body;
  const sql = `INSERT INTO Employee (SIN, firstName, lastName, personID, positions, hotelId) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [SIN, firstName, lastName, personID, positions, hotelId], function(err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ SIN: this.lastID });
  });
});

// Read all Employees
app.get('/employees', (req, res) => {
  const sql = `SELECT * FROM Employee`;
  db.all(sql, [], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows);
  });
});

app.get('/employees/:SIN', (req, res) => {
  const { SIN } = req.params;
  const sql = `SELECT * FROM Employee WHERE SIN = ?`;

  db.get(sql, [SIN], (err, row) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      if (row) {
          res.json(row);
      } else {
          res.status(404).json({ message: 'Employee not found' });
      }
  });
});

// Update an Employee
app.put('/employees/:SIN', (req, res) => {
  const { firstName, lastName, personID, positions, hotelId } = req.body;
  const SIN = req.params.SIN;
  const sql = `UPDATE Employee 
               SET firstName = ?, lastName = ?, personID = ?, positions = ?, hotelId = ? 
               WHERE SIN = ?`;
  db.run(sql, [firstName, lastName, personID, positions, hotelId, SIN], function(err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      console.log(`Rows updated: ${this.changes}`); // Log how many rows were updated
      res.json({ updated: this.changes });
  });
});

// Delete an Employee
app.delete('/employees/:SIN', (req, res) => {
  const { sin } = req.params;
  const sql = `DELETE FROM Employee WHERE SIN = ?`;
  db.run(sql, sin, function(err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ deleted: this.changes });
  });
});

// Create a Manager
app.post('/managers', (req, res) => {
  const { personID, employeeSIN, hotelId } = req.body;
  db.run(`INSERT INTO Manager (personID, employeeSIN, hotelId) VALUES (?, ?, ?)`, [personID, employeeSIN, hotelId], function(err) {
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
  const { employeeSIN, hotelId } = req.body;
  const { personID } = req.params;
  db.run(`UPDATE Manager SET employeeSIN = ?, hotelId = ? WHERE personID = ?`, [employeeSIN, hotelId, personID], function(err) {
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

app.get('/search', (req, res) => {
  console.log('test');
  const { startDate, endDate, capacity, area, hotelChain, category, totalRooms, price } = req.query;
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

  let query = `SELECT * FROM Room JOIN Hotel ON Room.hotelId = Hotel.id WHERE 1=1`;
  const params = [];

  if (startDate && endDate) {
    query += ` AND Room.roomNumber NOT IN (SELECT roomNumber FROM Books WHERE startDate <= ? AND endDate >= ?)`;
    params.push(endDate, startDate);
  }
  if (capacity) {
    query += ` AND capacity >= ?`;
    params.push(capacity);
  }
  if (area) {
    query += ` AND Hotel.city = ?`;
    params.push(area);
  }
  if (hotelChain) {
    query += ` AND Hotel.hotelChainId = (SELECT id FROM HotelChain WHERE name = ?)`;
    params.push(hotelChain);
  }
  if (category) {
    query += ` AND stars = ?`;
    params.push(category);
  }
  if (totalRooms) {
    query += ` AND numberOfRooms = ?`;
    params.push(totalRooms);
  }
  if (price) {
    query += ` AND price <= ?`;
    params.push(price);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });

  db.close();
});

app.post('/customers', (req, res) => {
  // Now also extracting firstName and lastName from the request body
  const { hotelId, dateOfRegistration, personID, firstName, lastName } = req.body;

  if (!dateOfRegistration || !personID || !firstName || !lastName) {
    // Respond with an error if validation for any field fails
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `INSERT INTO Customer (hotelId, dateOfRegistration, personID, firstName, lastName) VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [hotelId, dateOfRegistration, personID, firstName, lastName], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

app.get('/customers/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM Customer WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      if (row) {
        res.json(row);
      } else {
        res.status(404).json({ error: "Customer not found" });
      }
    }
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

// Read all Customers
app.get('/customers', (req, res) => {
  db.all(`SELECT * FROM Customer`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get('/customers-with-names', (req, res) => {
  const sql = `
    SELECT Customer.id, Person.firstName, Person.lastName
    FROM Customer
    JOIN Person ON Customer.personID = Person.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/customers/:id', (req, res) => {
  // Including firstName and lastName in the update
  const { hotelId, dateOfRegistration, personID, firstName, lastName } = req.body;
  const { id } = req.params; // ID of the customer to update

  // Assuming that firstName and lastName should also be updated
  const sql = `UPDATE Customer SET hotelId = ?, dateOfRegistration = ?, personID = ?, firstName = ?, lastName = ? WHERE id = ?`;

  db.run(sql, [hotelId, dateOfRegistration, personID, firstName, lastName, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ updated: this.changes });
    }
  });
});

// Create a Payment
app.post('/payments', (req, res) => {
  const { bookingID, amount, paymentDate, hotelId } = req.body;
  db.run(`INSERT INTO Payment (bookingID, amount, paymentDate, hotelId) VALUES (?, ?, ?, ?)`, [bookingID, amount, paymentDate, hotelId], function(err) {
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

app.get('/payments/:id', (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters
  
  const sql = `SELECT * FROM Payment WHERE id = ?`;

  db.get(sql, [id], (err, row) => {
    if (err) {
      // If there's an error during the query, send a 500 (Internal Server Error) response with the error message
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      // If the query was successful but no payment was found with the provided ID, send a 404 (Not Found) response
      res.status(404).json({ message: 'Payment not found' });
    } else {
      // If a payment was found with the provided ID, return it in a 200 (OK) response
      res.json(row);
    }
  });
});

// Update a Payment
app.put('/payments/:id', (req, res) => {
  const { bookingID, amount, paymentDate, hotelId } = req.body;
  const { id } = req.params;
  db.run(`UPDATE Payment SET bookingID = ?, amount = ?, paymentDate = ?, hotelId = ? WHERE id = ?`, [bookingID, amount, paymentDate, hotelId, id], function(err) {
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

app.post('/books', (req, res) => {
  // Include hotelId in the destructured assignment
  const { customerID, roomNumber, startDate, endDate, hotelId, paymentID, checkIn } = req.body;
  // Make sure to include hotelId in the VALUES list
  db.run(`INSERT INTO Books (customerID, roomNumber, startDate, endDate, hotelId, paymentID, checkIn) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
  [customerID, roomNumber, startDate, endDate, hotelId, paymentID, checkIn], function(err) {
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

app.get('/books/:id', (req, res) => {

  const { id } = req.params; // Extract the ID from the request parameters
  const sql = `SELECT * FROM Books WHERE id = ?`;

  db.get(sql, [id], (err, row) => {
    if (err) {
      // If there's an error during the query, send a 500 (Internal Server Error) response with the error message
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      // If the query was successful but no book was found with the provided ID, send a 404 (Not Found) response
      res.status(404).json({ message: 'Booking not found' });
    } else {
      // If a book was found with the provided ID, return it in a 200 (OK) response
      res.json(row);
    }

  });
});

app.put('/books/:id', (req, res) => {
  // Assuming `hotelId` is now part of the information you want to update
  const { customerID, hotelId, roomNumber, startDate, endDate, paymentID, checkIn } = req.body;
  const { id } = req.params;

  db.run(`UPDATE Books SET customerID = ?, hotelId = ?, roomNumber = ?, startDate = ?, endDate = ?, paymentID = ?, checkin = ? WHERE id = ?`, 
  [customerID, hotelId, roomNumber, startDate, endDate, paymentID, checkIn, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ updated: this.changes });
    }
  });
});

app.delete('/books/:id', (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters
  db.run(`DELETE FROM Books WHERE id = ?`, [id], function(err) {
    if (err) {
      // If there's an error, send a 500 (Internal Server Error) response with the error message
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      // If no rows were affected (i.e., no booking was found with the provided ID), send a 404 (Not Found) response
      res.status(404).json({ error: 'Booking not found' });
    } else {
      // If the booking was successfully deleted, send a 200 (OK) response with the number of affected rows
      res.json({ deleted: this.changes });
    }
  });
});

app.get('/archive', (req, res) => {
  const sql = 'SELECT * FROM BookingArchive';

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// app.get('/archive', (req, res) => {
//   const sql = 'SELECT * FROM BookingArchive';

//   db.all(sql, [], (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(rows);
//   });
// });

// app.get('/archive-all-bookings', (req, res) => {
//   db.all(`SELECT * FROM Books`, [], (err, rows) => {
//     if (err) {
//       console.error(err.message);
//       res.status(500).send('Failed to fetch bookings for archiving.');
//       return;
//     }

//     rows.forEach(booking => {
//       db.run(`INSERT INTO BookingArchive (OriginalBookingID, CustomerID, HotelID, RoomNumber, StartDate, EndDate, PaymentID, CheckIn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
//       [booking.id, booking.customerID, booking.hotelId, booking.roomNumber, booking.startDate, booking.endDate, booking.paymentID, booking.checkIn], 
//       (archiveErr) => {
//         if (archiveErr) {
//           console.error('Failed to archive booking:', archiveErr.message);
//           // Handle error
//         }
//       });
//     });

//     res.send('Archiving process initiated.');
//   });
// });

app.get('/search', (req, res) => {
  const { startDate, endDate, capacity, area, hotelChain, category, totalRooms, price } = req.query;

  let query = `
    SELECT 
      Room.*, 
      Hotel.name AS hotelName, 
      Hotel.city AS hotelCity, 
      HotelChain.name AS hotelChainName
    FROM Room
    INNER JOIN Hotel ON Room.hotelId = Hotel.id
    LEFT JOIN HotelChain ON Hotel.hotelChainId = HotelChain.id
    WHERE 1=1
  `;

  const queryParams = [];

  if (startDate && endDate) {
    query += ` AND Room.roomNumber NOT IN (
      SELECT roomNumber FROM Books
      WHERE hotelId = Room.hotelId AND ((startDate BETWEEN ? AND ?) OR (endDate BETWEEN ? AND ?))
    )`;
    queryParams.push(startDate, endDate, startDate, endDate);
  }

  if (capacity) {
    query += ` AND Room.capacity >= ?`;
    queryParams.push(capacity);
  }

  if (area) {
    query += ` AND Hotel.city = ?`;
    queryParams.push(area);
  }

  if (hotelChain) {
    query += ` AND HotelChain.name = ?`;
    queryParams.push(hotelChain);
  }

  if (category) {
    query += ` AND Hotel.stars = ?`;
    queryParams.push(category);
  }

  if (totalRooms) {
    query += ` AND Hotel.numberOfRooms >= ?`;
    queryParams.push(totalRooms);
  }

  if (price) {
    query += ` AND Room.price <= ?`;
    queryParams.push(price);
  }

  db.all(query, queryParams, (err, rooms) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rooms);
    }
  });
});

app.get('/unique-areas', (req, res) => {
  const sql = `SELECT DISTINCT city FROM Hotel ORDER BY city ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows.map(row => row.city));
  });
});

  // ... include CRUD operations for other tables ...
  
  // Start server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  
})