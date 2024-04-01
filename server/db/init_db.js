const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'hotel_database.db');

const dropTables = (db) => {
    db.serialize(() => {
        // Drop tables in reverse order of dependency
        const tables = ['Search', 'Books', 'Payment', 'Customer', 'Employee', 'Manager', 'Room', 'Hotel', 'HotelChain', 'BookingArchive'];
        tables.forEach(table => {
            db.run(`DROP TABLE IF EXISTS ${table};`, err => {
                if (err) {
                    console.error(`Error dropping ${table}: `, err.message);
                } else {
                    console.log(`${table} table dropped.`);
                }
            });
        });
    });

};

// Connect to the SQLite database
const insertHotelChains = (db) => {
    const hotelChains = [
        { address: '123 Chain St, City A, NA', numberOfHotels: 12, emailAddress: 'contact@chainA.com', phoneNumber: '111-111-1111' },
        { address: '456 Chain Ave, City B, NA', numberOfHotels: 15, emailAddress: 'info@chainB.com', phoneNumber: '222-222-2222' },
        { address: '789 Chain Rd, City C, NA', numberOfHotels: 10, emailAddress: 'support@chainC.com', phoneNumber: '333-333-3333' },
        { address: '101 Chain Blvd, City A, NA', numberOfHotels: 9, emailAddress: 'hello@chainD.com', phoneNumber: '444-444-4444' },
        { address: '202 Chain Ln, City B, NA', numberOfHotels: 8, emailAddress: 'service@chainE.com', phoneNumber: '555-555-5555' }
    ];

    hotelChains.forEach(chain => {
        db.run(`INSERT INTO HotelChain (address, numberOfHotels, emailAddress, phoneNumber) VALUES (?, ?, ?, ?)`,
        [chain.address, chain.numberOfHotels, chain.emailAddress, chain.phoneNumber], function(err) {
            if (err) console.error(err.message);
          else console.log(`Hotel Chain inserted with ID: ${chain.address}`);
        });
    });
};

// const insertBookings = (db) => {
//     const bookings = [
//         { customerID: 1, paymentID: 1, roomNumber: '3902', startDate: '2024-04-01', endDate: '2024-04-05', hotelId: 1, checkIn: false},
//         { customerID: 2, paymentID: 2, roomNumber: '4005', startDate: '2024-04-10', endDate: '2024-04-15', hotelId: 2, checkIn: false},
//         { customerID: 3, paymentID: 3, roomNumber: '4004', startDate: '2024-05-01', endDate: '2024-05-08', hotelId: 3, checkIn: false},
//         { customerID: 4, paymentID: 4, roomNumber: '3603', startDate: '2024-06-10', endDate: '2024-06-20', hotelId: 4, checkIn: false},
//         { customerID: 5, paymentID: 5, roomNumber: '2801', startDate: '2024-07-01', endDate: '2024-07-05', hotelId: 5, checkIn: false}
//     ];

//     bookings.forEach(booking => {
//         db.run(`INSERT INTO Books (customerID, paymentID, roomNumber, startDate, endDate, hotelId, checkIn) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [booking.customerID, booking.paymentID, booking.roomNumber, booking.startDate, booking.endDate, booking.hotelId, booking.checkIn], function(err) {
//             if (err) console.error(err.message);
//             else console.log(`Booking inserted for Customer ID: ${booking.customerID}`);
//         });
//     });
// };

const insertBookings = (db) => {
  const bookings = [
      { customerID: 1, paymentID: 1, roomNumber: '3902', startDate: '2024-04-01', endDate: '2024-04-05', hotelId: 1, checkIn: false},
      { customerID: 2, paymentID: 2, roomNumber: '4005', startDate: '2024-04-10', endDate: '2024-04-15', hotelId: 2, checkIn: false},
      { customerID: 3, paymentID: 3, roomNumber: '4004', startDate: '2024-05-01', endDate: '2024-05-08', hotelId: 3, checkIn: false},
      { customerID: 4, paymentID: 4, roomNumber: '3603', startDate: '2024-06-10', endDate: '2024-06-20', hotelId: 4, checkIn: false},
      { customerID: 5, paymentID: 5, roomNumber: '2801', startDate: '2024-07-01', endDate: '2024-07-05', hotelId: 5, checkIn: false}
  ];

  bookings.forEach(booking => {
      db.run(`INSERT INTO Books (customerID, paymentID, roomNumber, startDate, endDate, hotelId, checkIn) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [booking.customerID, booking.paymentID, booking.roomNumber, booking.startDate, booking.endDate, booking.hotelId, booking.checkIn], function(err) {
          if (err) {
              console.error("Error inserting into Books:", err.message);
          } else {
              console.log(`Booking inserted for Customer ID: ${booking.customerID}`);
              const lastBookingId = this.lastID; // Capturing the last inserted booking ID
              
              // Insert into BookingArchive
              db.run(`INSERT INTO BookingArchive (OriginalBookingID, CustomerID, HotelID, RoomNumber, StartDate, EndDate, PaymentID, CheckIn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [lastBookingId, booking.customerID, booking.hotelId, booking.roomNumber, booking.startDate, booking.endDate, booking.paymentID, booking.checkIn], archiveErr => {
                  if (archiveErr) {
                      console.error("Error inserting into BookingArchive:", archiveErr.message);
                  } else {
                      console.log(`Booking archived successfully for Customer ID: ${booking.customerID}`);
                  }
              });
          }
      });
  });
};

const insertEmployees = (db) => {
  const employees = [
      { SIN: '123456789', firstName: 'John', lastName: 'Doe', personID: 1, positions: 'Manager', hotelId: 1 },
      { SIN: '234567891', firstName: 'Jane', lastName: 'Doe', personID: 2, positions: 'Receptionist', hotelId: 1 },
      { SIN: '345678912', firstName: 'Jim', lastName: 'Beam', personID: 3, positions: 'Housekeeper', hotelId: 2 },
      { SIN: '456789123', firstName: 'Jack', lastName: 'Daniels', personID: 4, positions: 'Chef', hotelId: 2 },
      { SIN: '567891234', firstName: 'Josie', lastName: 'Wales', personID: 5, positions: 'Other', hotelId: 3 }
  ];

  employees.forEach(employee => {
      db.run(`INSERT INTO Employee (SIN, firstName, lastName, personID, positions, hotelId) VALUES (?, ?, ?, ?, ?, ?)`,
      [employee.SIN, employee.firstName, employee.lastName, employee.personID, employee.positions, employee.hotelId], function(err) {
          if (err) console.error(err.message);
          else console.log(`Employee inserted with SIN: ${employee.SIN}`);
      });
  });
};


const insertCustomers = (db) => {
  // Updated sample customers with firstName and lastName
  const customers = [
      { firstName: 'Alice', lastName: 'Johnson', hotelId: 1, dateOfRegistration: '2023-01-01', personID: 1 },
      { firstName: 'Bob', lastName: 'Smith', hotelId: 1, dateOfRegistration: '2023-01-02', personID: 2 },
      { firstName: 'Charlie', lastName: 'Davis', hotelId: 2, dateOfRegistration: '2023-02-01', personID: 3 },
      { firstName: 'Diana', lastName: 'Brown', hotelId: 2, dateOfRegistration: '2023-02-15', personID: 4 },
      { firstName: 'Evan', lastName: 'Miller', hotelId: 3, dateOfRegistration: '2023-03-10', personID: 5 },
      // Add more customers as needed
  ];

  // Iterate over each customer and insert into the database
  customers.forEach(customer => {
      db.run(`INSERT INTO Customer (firstName, lastName, hotelId, dateOfRegistration, personID) VALUES (?, ?, ?, ?, ?)`, 
          [customer.firstName, customer.lastName, customer.hotelId, customer.dateOfRegistration, customer.personID], function(err) {
              if (err) console.error("Error inserting customer:", err.message);
              else console.log(`Customer inserted with ID: ${this.lastID}`);
          });
  });
};


const insertPayments = (db) => {
    const payments = [
        { bookingID: 1, amount: 500.00, paymentDate: '2024-03-25', hotelId: 1 },
        { bookingID: 2, amount: 750.00, paymentDate: '2024-03-30', hotelId: 2 },
        { bookingID: 3, amount: 1200.00, paymentDate: '2024-04-15', hotelId: 3 },
        { bookingID: 4, amount: 1500.00, paymentDate: '2024-05-20', hotelId: 4 },
        { bookingID: 5, amount: 300.00, paymentDate: '2024-06-01', hotelId: 5 }
    ];

    payments.forEach(payment => {
        db.run(`INSERT INTO Payment (bookingID, amount, paymentDate, hotelId) VALUES (?, ?, ?, ?)`,
        [payment.bookingID, payment.amount, payment.paymentDate, payment.hotelId], function(err) {
            if (err) console.error(err.message);
            else console.log(`Payment inserted for Booking ID: ${payment.bookingID}`);
        });
    });
};

const insertPersons = (db) => {
    const persons = [
        { firstName: 'John', lastName: 'Doe', address: '123 Elm Street' },
        { firstName: 'Jane', lastName: 'Doe', address: '456 Oak Street' },
        { firstName: 'Jim', lastName: 'Beam', address: '789 Pine Street' },
        { firstName: 'Jack', lastName: 'Daniels', address: '101 Maple Street' },
        { firstName: 'Josie', lastName: 'Wales', address: '202 Birch Street' }
    ];

    persons.forEach(person => {
        db.run(`INSERT INTO Person (firstName, lastName, address) VALUES (?, ?, ?)`,
        [person.firstName, person.lastName, person.address], function(err) {
            if (err) console.error(err.message);
            else console.log(`Person inserted with name: ${person.firstName} ${person.lastName}`);
        });
    });
};
  
const insertHotels = (db) => {
  const hotels = [
      // Hotel Chain 1
      { hotelChainId: 1, name: 'Hotel A1', stars: 5, city: "Berlin", address: '100 Main St, City A, NA', numberOfRooms: 5, emailAddress: 'contact@hotela1.com', phoneNumber: '100-100-1000', manager: 'Manager A1' },
      { hotelChainId: 1, name: 'Hotel A2', stars: 4, city: "Vancouver", address: '101 Main St, City A, NA', numberOfRooms: 5, emailAddress: 'info@hotela2.com', phoneNumber: '100-100-1001', manager: 'Manager A2' },
      { hotelChainId: 1, name: 'Hotel A3', stars: 3, city: "Ottawa", address: '102 Main St, City B, NA', numberOfRooms: 5, emailAddress: 'support@hotela3.com', phoneNumber: '100-100-1002', manager: 'Manager A3' },
      { hotelChainId: 1, name: 'Hotel A4', stars: 4, city: "Calgary", address: '103 Main St, City B, NA', numberOfRooms: 5, emailAddress: 'contact@hotela4.com', phoneNumber: '100-100-1003', manager: 'Manager A4' },
      { hotelChainId: 1, name: 'Hotel A5', stars: 3, city: "Toronto", address: '104 Main St, City C, NA', numberOfRooms: 5, emailAddress: 'info@hotela5.com', phoneNumber: '100-100-1004', manager: 'Manager A5' },
      { hotelChainId: 1, name: 'Hotel A6', stars: 4, city: "Vancouver", address: '105 Main St, City C, NA', numberOfRooms: 5, emailAddress: 'support@hotela6.com', phoneNumber: '100-100-1005', manager: 'Manager A6' },
      { hotelChainId: 1, name: 'Hotel A7', stars: 3, city: "Toronto", address: '106 Main St, City D, NA', numberOfRooms: 5, emailAddress: 'contact@hotela7.com', phoneNumber: '100-100-1006', manager: 'Manager A7' },
      { hotelChainId: 1, name: 'Hotel A8', stars: 5, city: "Berlin", address: '107 Main St, City D, NA', numberOfRooms: 5, emailAddress: 'info@hotela8.com', phoneNumber: '100-100-1007', manager: 'Manager A8' },
      // Hotel Chain 2
      { hotelChainId: 2, name: 'Hotel B1', stars: 5, city: "London", address: '200 Main St, City E, NA', numberOfRooms: 5, emailAddress: 'contact@hotelb1.com', phoneNumber: '200-200-2000', manager: 'Manager B1' },
      { hotelChainId: 2, name: 'Hotel B2', stars: 4, city: "Paris", address: '201 Main St, City E, NA', numberOfRooms: 5, emailAddress: 'info@hotelb2.com', phoneNumber: '200-200-2001', manager: 'Manager B2' },
      { hotelChainId: 2, name: 'Hotel B3', stars: 3, city: "Toronto", address: '202 Main St, City F, NA', numberOfRooms: 5, emailAddress: 'support@hotelb3.com', phoneNumber: '200-200-2002', manager: 'Manager B3' },
      { hotelChainId: 2, name: 'Hotel B4', stars: 4, city: "Vancouver", address: '203 Main St, City F, NA', numberOfRooms: 5, emailAddress: 'contact@hotelb4.com', phoneNumber: '200-200-2003', manager: 'Manager B4' },
      { hotelChainId: 2, name: 'Hotel B5', stars: 3, city: "Rome", address: '204 Main St, City G, NA', numberOfRooms: 5, emailAddress: 'info@hotelb5.com', phoneNumber: '200-200-2004', manager: 'Manager B5' },
      { hotelChainId: 2, name: 'Hotel B6', stars: 4, city: "Vancouver", address: '205 Main St, City G, NA', numberOfRooms: 5, emailAddress: 'support@hotelb6.com', phoneNumber: '200-200-2005', manager: 'Manager B6' },
      { hotelChainId: 2, name: 'Hotel B7', stars: 3, city: "Toronto", address: '206 Main St, City H, NA', numberOfRooms: 5, emailAddress: 'contact@hotelb7.com', phoneNumber: '200-200-2006', manager: 'Manager B7' },
      { hotelChainId: 2, name: 'Hotel B8', stars: 5, city: "Berlin", address: '207 Main St, City H, NA', numberOfRooms: 5, emailAddress: 'info@hotelb8.com', phoneNumber: '200-200-2007', manager: 'Manager B8' },
      // Hotel Chain 3
      { hotelChainId: 3, name: 'Hotel C1', stars: 5, city: "Berlin", address: '300 Main St, City I, NA', numberOfRooms: 5, emailAddress: 'contact@hotelc1.com', phoneNumber: '300-300-3000', manager: 'Manager C1' },
      { hotelChainId: 3, name: 'Hotel C2', stars: 4, city: "Sydney", address: '301 Main St, City I, NA', numberOfRooms: 5, emailAddress: 'info@hotelc2.com', phoneNumber: '300-300-3001', manager: 'Manager C2' },
      { hotelChainId: 3, name: 'Hotel C3', stars: 3, city: "Victoria", address: '302 Main St, City J, NA', numberOfRooms: 5, emailAddress: 'support@hotelc3.com', phoneNumber: '300-300-3002', manager: 'Manager C3' },
      { hotelChainId: 3, name: 'Hotel C4', stars: 4, city: "Vancouver", address: '303 Main St, City J, NA', numberOfRooms: 5, emailAddress: 'contact@hotelc4.com', phoneNumber: '300-300-3003', manager: 'Manager C4' },
      { hotelChainId: 3, name: 'Hotel C5', stars: 3, city: "Toronto", address: '304 Main St, City K, NA', numberOfRooms: 5, emailAddress: 'info@hotelc5.com', phoneNumber: '300-300-3004', manager: 'Manager C5' },
      { hotelChainId: 3, name: 'Hotel C6', stars: 4, city: "Dallas", address: '305 Main St, City K, NA', numberOfRooms: 5, emailAddress: 'support@hotelc6.com', phoneNumber: '300-300-3005', manager: 'Manager C6' },
      { hotelChainId: 3, name: 'Hotel C7', stars: 3, city: "Toronto", address: '306 Main St, City L, NA', numberOfRooms: 5, emailAddress: 'contact@hotelc7.com', phoneNumber: '300-300-3006', manager: 'Manager C7' },
      { hotelChainId: 3, name: 'Hotel C8', stars: 5, city: "Berlin", address: '307 Main St, City L, NA', numberOfRooms: 5, emailAddress: 'info@hotelc8.com', phoneNumber: '300-300-3007', manager: 'Manager C8' },
      // Hotel Chain 4
      { hotelChainId: 4, name: 'Hotel D1', stars: 5, city: "Berlin", address: '400 Main St, City M, NA', numberOfRooms: 5, emailAddress: 'contact@hoteld1.com', phoneNumber: '400-400-4000', manager: 'Manager D1' },
      { hotelChainId: 4, name: 'Hotel D2', stars: 4, city: "Montreal", address: '401 Main St, City N, NA', numberOfRooms: 5, emailAddress: 'info@hoteld2.com', phoneNumber: '400-400-4001', manager: 'Manager D2' },
      { hotelChainId: 4, name: 'Hotel D3', stars: 3, city: "Toronto", address: '402 Main St, City O, NA', numberOfRooms: 5, emailAddress: 'support@hoteld3.com', phoneNumber: '400-400-4002', manager: 'Manager D3' },
      { hotelChainId: 4, name: 'Hotel D4', stars: 4, city: "Montreal", address: '403 Main St, City P, NA', numberOfRooms: 5, emailAddress: 'contact@hoteld4.com', phoneNumber: '400-400-4003', manager: 'Manager D4' },
      { hotelChainId: 4, name: 'Hotel D5', stars: 3, city: "Montreal", address: '404 Main St, City Q, NA', numberOfRooms: 5, emailAddress: 'info@hoteld5.com', phoneNumber: '400-400-4004', manager: 'Manager D5' },
      { hotelChainId: 4, name: 'Hotel D6', stars: 4, city: "Vancouver", address: '405 Main St, City R, NA', numberOfRooms: 5, emailAddress: 'support@hoteld6.com', phoneNumber: '400-400-4005', manager: 'Manager D6' },
      { hotelChainId: 4, name: 'Hotel D7', stars: 3, city: "Toronto", address: '406 Main St, City S, NA', numberOfRooms: 5, emailAddress: 'contact@hoteld7.com', phoneNumber: '400-400-4006', manager: 'Manager D7' },
      { hotelChainId: 4, name: 'Hotel D8', stars: 5, city: "Berlin", address: '407 Main St, City T, NA', numberOfRooms: 5, emailAddress: 'info@hoteld8.com', phoneNumber: '400-400-4007', manager: 'Manager D8' },
      // Hotel Chain 5
      { hotelChainId: 5, name: 'Hotel E1', stars: 5, city: "Berlin", address: '500 Main St, City U, NA', numberOfRooms: 5, emailAddress: 'contact@hotele1.com', phoneNumber: '500-500-5000', manager: 'Manager E1' },
      { hotelChainId: 5, name: 'Hotel E2', stars: 4, city: "Vancouver", address: '501 Main St, City V, NA', numberOfRooms: 5, emailAddress: 'info@hotele2.com', phoneNumber: '500-500-5001', manager: 'Manager E2' },
      { hotelChainId: 5, name: 'Hotel E3', stars: 3, city: "Toronto", address: '502 Main St, City W, NA', numberOfRooms: 5, emailAddress: 'support@hotele3.com', phoneNumber: '500-500-5002', manager: 'Manager E3' },
      { hotelChainId: 5, name: 'Hotel E4', stars: 4, city: "Ottawa", address: '503 Main St, City X, NA', numberOfRooms: 5, emailAddress: 'contact@hotele4.com', phoneNumber: '500-500-5003', manager: 'Manager E4' },
      { hotelChainId: 5, name: 'Hotel E5', stars: 3, city: "Ottawa", address: '504 Main St, City Y, NA', numberOfRooms: 5, emailAddress: 'info@hotele5.com', phoneNumber: '500-500-5004', manager: 'Manager E5' },
      { hotelChainId: 5, name: 'Hotel E6', stars: 4, city: "Ottawa", address: '505 Main St, City Z, NA', numberOfRooms: 5, emailAddress: 'support@hotele6.com', phoneNumber: '500-500-5005', manager: 'Manager E6' },
      { hotelChainId: 5, name: 'Hotel E7', stars: 3, city: "Toronto", address: '506 Main St, City AA, NA', numberOfRooms: 5, emailAddress: 'contact@hotele7.com', phoneNumber: '500-500-5006', manager: 'Manager E7' },
      { hotelChainId: 5, name: 'Hotel E8', stars: 5, city: "Berlin", address: '507 Main St, City AB, NA', numberOfRooms: 5, emailAddress: 'info@hotele8.com', phoneNumber: '500-500-5007', manager: 'Manager E8' }
  ];

  hotels.forEach(hotel => {
      db.run(`INSERT INTO Hotel (hotelChainId, name, stars, city, address, numberOfRooms, emailAddress, phoneNumber, manager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [hotel.hotelChainId, hotel.name, hotel.stars, hotel.city, hotel.address, hotel.numberOfRooms, hotel.emailAddress, hotel.phoneNumber, hotel.manager], function (err) {
              if (err) console.error(err.message);
              else console.log(`Hotel inserted with ID: ${this.lastID}`);
          });
  });
};

    
  const insertRooms = (db) => {
    const rooms = [
        {"hotelId": 1, "roomNumber": "101", "price": 80, "capacity": 1, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 1, "roomNumber": "102", "price": 100, "capacity": 2, "status": "Maintenance", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Loose doorknob"},
        {"hotelId": 1, "roomNumber": "103", "price": 120, "capacity": 3, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 1, "roomNumber": "104", "price": 100, "capacity": 4, "status": "Maintenance", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 1, "roomNumber": "105", "price": 150, "capacity": 5, "status": "Occupied", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 2, "roomNumber": "201", "price": 80, "capacity": 1, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 2, "roomNumber": "202", "price": 100, "capacity": 2, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": ""},
        {"hotelId": 2, "roomNumber": "203", "price": 120, "capacity": 3, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 2, "roomNumber": "204", "price": 80, "capacity": 4, "status": "Available", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 2, "roomNumber": "205", "price": 220, "capacity": 5, "status": "Available", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 3, "roomNumber": "301", "price": 100, "capacity": 1, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": ""},
        {"hotelId": 3, "roomNumber": "302", "price": 100, "capacity": 2, "status": "Maintenance", "view": "None", "extendable": "No", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 3, "roomNumber": "303", "price": 120, "capacity": 3, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 3, "roomNumber": "304", "price": 150, "capacity": 4, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 3, "roomNumber": "305", "price": 150, "capacity": 5, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 4, "roomNumber": "401", "price": 120, "capacity": 1, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 4, "roomNumber": "402", "price": 150, "capacity": 2, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 4, "roomNumber": "403", "price": 120, "capacity": 3, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 4, "roomNumber": "404", "price": 220, "capacity": 4, "status": "Maintenance", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 4, "roomNumber": "405", "price": 100, "capacity": 5, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 5, "roomNumber": "501", "price": 100, "capacity": 1, "status": "Maintenance", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Loose doorknob"},
        {"hotelId": 5, "roomNumber": "502", "price": 120, "capacity": 2, "status": "Maintenance", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 5, "roomNumber": "503", "price": 150, "capacity": 3, "status": "Available", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 5, "roomNumber": "504", "price": 100, "capacity": 4, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 5, "roomNumber": "505", "price": 80, "capacity": 5, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 6, "roomNumber": "601", "price": 120, "capacity": 1, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 6, "roomNumber": "602", "price": 100, "capacity": 2, "status": "Available", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 6, "roomNumber": "603", "price": 200, "capacity": 3, "status": "Maintenance", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 6, "roomNumber": "604", "price": 200, "capacity": 4, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 6, "roomNumber": "605", "price": 120, "capacity": 5, "status": "Maintenance", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 7, "roomNumber": "701", "price": 200, "capacity": 1, "status": "Maintenance", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 7, "roomNumber": "702", "price": 120, "capacity": 2, "status": "Available", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": ""},
        {"hotelId": 7, "roomNumber": "703", "price": 120, "capacity": 3, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 7, "roomNumber": "704", "price": 200, "capacity": 4, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 7, "roomNumber": "705", "price": 120, "capacity": 5, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 8, "roomNumber": "801", "price": 80, "capacity": 1, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 8, "roomNumber": "802", "price": 100, "capacity": 2, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 8, "roomNumber": "803", "price": 80, "capacity": 3, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 8, "roomNumber": "804", "price": 200, "capacity": 4, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 8, "roomNumber": "805", "price": 120, "capacity": 5, "status": "Available", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 9, "roomNumber": "901", "price": 150, "capacity": 1, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 9, "roomNumber": "902", "price": 100, "capacity": 2, "status": "Occupied", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 9, "roomNumber": "903", "price": 200, "capacity": 3, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 9, "roomNumber": "904", "price": 100, "capacity": 4, "status": "Occupied", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 9, "roomNumber": "905", "price": 120, "capacity": 5, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 10, "roomNumber": "1001", "price": 200, "capacity": 1, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": ""},
        {"hotelId": 10, "roomNumber": "1002", "price": 80, "capacity": 2, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 10, "roomNumber": "1003", "price": 200, "capacity": 3, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 10, "roomNumber": "1004", "price": 200, "capacity": 4, "status": "Occupied", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 10, "roomNumber": "1005", "price": 150, "capacity": 5, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 11, "roomNumber": "1101", "price": 150, "capacity": 1, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": ""},
        {"hotelId": 11, "roomNumber": "1102", "price": 80, "capacity": 2, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": ""},
        {"hotelId": 11, "roomNumber": "1103", "price": 100, "capacity": 3, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 11, "roomNumber": "1104", "price": 80, "capacity": 4, "status": "Available", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 11, "roomNumber": "1105", "price": 100, "capacity": 5, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Loose doorknob"},
        {"hotelId": 12, "roomNumber": "1201", "price": 120, "capacity": 1, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": ""},
        {"hotelId": 12, "roomNumber": "1202", "price": 220, "capacity": 2, "status": "Available", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 12, "roomNumber": "1203", "price": 200, "capacity": 3, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 12, "roomNumber": "1204", "price": 100, "capacity": 4, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 12, "roomNumber": "1205", "price": 150, "capacity": 5, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 13, "roomNumber": "1301", "price": 80, "capacity": 1, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 13, "roomNumber": "1302", "price": 200, "capacity": 2, "status": "Occupied", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 13, "roomNumber": "1303", "price": 100, "capacity": 3, "status": "Available", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 13, "roomNumber": "1304", "price": 220, "capacity": 4, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 13, "roomNumber": "1305", "price": 120, "capacity": 5, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 14, "roomNumber": "1401", "price": 80, "capacity": 1, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 14, "roomNumber": "1402", "price": 120, "capacity": 2, "status": "Occupied", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 14, "roomNumber": "1403", "price": 100, "capacity": 3, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 14, "roomNumber": "1404", "price": 220, "capacity": 4, "status": "Maintenance", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": ""},
        {"hotelId": 14, "roomNumber": "1405", "price": 220, "capacity": 5, "status": "Maintenance", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 15, "roomNumber": "1501", "price": 200, "capacity": 1, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 15, "roomNumber": "1502", "price": 200, "capacity": 2, "status": "Available", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 15, "roomNumber": "1503", "price": 200, "capacity": 3, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 15, "roomNumber": "1504", "price": 200, "capacity": 4, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 15, "roomNumber": "1505", "price": 100, "capacity": 5, "status": "Available", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 16, "roomNumber": "1601", "price": 150, "capacity": 1, "status": "Occupied", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 16, "roomNumber": "1602", "price": 120, "capacity": 2, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 16, "roomNumber": "1603", "price": 80, "capacity": 3, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 16, "roomNumber": "1604", "price": 200, "capacity": 4, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 16, "roomNumber": "1605", "price": 150, "capacity": 5, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 17, "roomNumber": "1701", "price": 120, "capacity": 1, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 17, "roomNumber": "1702", "price": 120, "capacity": 2, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 17, "roomNumber": "1703", "price": 80, "capacity": 3, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 17, "roomNumber": "1704", "price": 220, "capacity": 4, "status": "Available", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": ""},
        {"hotelId": 17, "roomNumber": "1705", "price": 120, "capacity": 5, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 18, "roomNumber": "1801", "price": 120, "capacity": 1, "status": "Maintenance", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 18, "roomNumber": "1802", "price": 150, "capacity": 2, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 18, "roomNumber": "1803", "price": 200, "capacity": 3, "status": "Maintenance", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 18, "roomNumber": "1804", "price": 120, "capacity": 4, "status": "Maintenance", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 18, "roomNumber": "1805", "price": 220, "capacity": 5, "status": "Available", "view": "None", "extendable": "No", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 19, "roomNumber": "1901", "price": 120, "capacity": 1, "status": "Available", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 19, "roomNumber": "1902", "price": 220, "capacity": 2, "status": "Maintenance", "view": "None", "extendable": "No", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 19, "roomNumber": "1903", "price": 220, "capacity": 3, "status": "Available", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 19, "roomNumber": "1904", "price": 200, "capacity": 4, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 19, "roomNumber": "1905", "price": 200, "capacity": 5, "status": "Available", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 20, "roomNumber": "2001", "price": 80, "capacity": 1, "status": "Occupied", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 20, "roomNumber": "2002", "price": 120, "capacity": 2, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 20, "roomNumber": "2003", "price": 100, "capacity": 3, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 20, "roomNumber": "2004", "price": 120, "capacity": 4, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 20, "roomNumber": "2005", "price": 200, "capacity": 5, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 21, "roomNumber": "2101", "price": 150, "capacity": 1, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 21, "roomNumber": "2102", "price": 200, "capacity": 2, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": ""},
        {"hotelId": 21, "roomNumber": "2103", "price": 120, "capacity": 3, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 21, "roomNumber": "2104", "price": 150, "capacity": 4, "status": "Available", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Loose doorknob"},
        {"hotelId": 21, "roomNumber": "2105", "price": 80, "capacity": 5, "status": "Occupied", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 22, "roomNumber": "2201", "price": 120, "capacity": 1, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": ""},
        {"hotelId": 22, "roomNumber": "2202", "price": 80, "capacity": 2, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 22, "roomNumber": "2203", "price": 100, "capacity": 3, "status": "Maintenance", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 22, "roomNumber": "2204", "price": 100, "capacity": 4, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 22, "roomNumber": "2205", "price": 200, "capacity": 5, "status": "Occupied", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 23, "roomNumber": "2301", "price": 120, "capacity": 1, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 23, "roomNumber": "2302", "price": 200, "capacity": 2, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 23, "roomNumber": "2303", "price": 120, "capacity": 3, "status": "Occupied", "view": "None", "extendable": "No", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 23, "roomNumber": "2304", "price": 100, "capacity": 4, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 23, "roomNumber": "2305", "price": 150, "capacity": 5, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 24, "roomNumber": "2401", "price": 80, "capacity": 1, "status": "Available", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 24, "roomNumber": "2402", "price": 220, "capacity": 2, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 24, "roomNumber": "2403", "price": 150, "capacity": 3, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 24, "roomNumber": "2404", "price": 120, "capacity": 4, "status": "Occupied", "view": "None", "extendable": "No", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 24, "roomNumber": "2405", "price": 200, "capacity": 5, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 25, "roomNumber": "2501", "price": 120, "capacity": 1, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": ""},
        {"hotelId": 25, "roomNumber": "2502", "price": 200, "capacity": 2, "status": "Maintenance", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 25, "roomNumber": "2503", "price": 80, "capacity": 3, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 25, "roomNumber": "2504", "price": 150, "capacity": 4, "status": "Maintenance", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 25, "roomNumber": "2505", "price": 100, "capacity": 5, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 26, "roomNumber": "2601", "price": 100, "capacity": 1, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 26, "roomNumber": "2602", "price": 120, "capacity": 2, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 26, "roomNumber": "2603", "price": 100, "capacity": 3, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 26, "roomNumber": "2604", "price": 120, "capacity": 4, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 26, "roomNumber": "2605", "price": 80, "capacity": 5, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 27, "roomNumber": "2701", "price": 120, "capacity": 1, "status": "Available", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 27, "roomNumber": "2702", "price": 100, "capacity": 2, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 27, "roomNumber": "2703", "price": 80, "capacity": 3, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 27, "roomNumber": "2704", "price": 150, "capacity": 4, "status": "Maintenance", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 27, "roomNumber": "2705", "price": 120, "capacity": 5, "status": "Occupied", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 28, "roomNumber": "2801", "price": 150, "capacity": 1, "status": "Occupied", "view": "None", "extendable": "No", "amenities": "WiFi, TV", "damages": ""},
        {"hotelId": 28, "roomNumber": "2802", "price": 200, "capacity": 2, "status": "Available", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 28, "roomNumber": "2803", "price": 150, "capacity": 3, "status": "Maintenance", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 28, "roomNumber": "2804", "price": 220, "capacity": 4, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 28, "roomNumber": "2805", "price": 80, "capacity": 5, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Loose doorknob"},
        {"hotelId": 29, "roomNumber": "2901", "price": 80, "capacity": 1, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": ""},
        {"hotelId": 29, "roomNumber": "2902", "price": 120, "capacity": 2, "status": "Available", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": ""},
        {"hotelId": 29, "roomNumber": "2903", "price": 200, "capacity": 3, "status": "Occupied", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 29, "roomNumber": "2904", "price": 100, "capacity": 4, "status": "Maintenance", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 29, "roomNumber": "2905", "price": 100, "capacity": 5, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Loose doorknob"},
        {"hotelId": 30, "roomNumber": "3001", "price": 80, "capacity": 1, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": ""},
        {"hotelId": 30, "roomNumber": "3002", "price": 100, "capacity": 2, "status": "Maintenance", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Minor scratch on table"},
        {"hotelId": 30, "roomNumber": "3003", "price": 80, "capacity": 3, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 30, "roomNumber": "3004", "price": 100, "capacity": 4, "status": "Available", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 30, "roomNumber": "3005", "price": 80, "capacity": 5, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 31, "roomNumber": "3101", "price": 150, "capacity": 1, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 31, "roomNumber": "3102", "price": 100, "capacity": 2, "status": "Maintenance", "view": "None", "extendable": "No", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 31, "roomNumber": "3103", "price": 100, "capacity": 3, "status": "Maintenance", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": ""},
        {"hotelId": 31, "roomNumber": "3104", "price": 80, "capacity": 4, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 31, "roomNumber": "3105", "price": 120, "capacity": 5, "status": "Maintenance", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Loose doorknob"},
        {"hotelId": 32, "roomNumber": "3201", "price": 120, "capacity": 1, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 32, "roomNumber": "3202", "price": 120, "capacity": 2, "status": "Maintenance", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 32, "roomNumber": "3203", "price": 220, "capacity": 3, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 32, "roomNumber": "3204", "price": 150, "capacity": 4, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 32, "roomNumber": "3205", "price": 80, "capacity": 5, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 33, "roomNumber": "3301", "price": 220, "capacity": 1, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 33, "roomNumber": "3302", "price": 80, "capacity": 2, "status": "Maintenance", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 33, "roomNumber": "3303", "price": 100, "capacity": 3, "status": "Available", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 33, "roomNumber": "3304", "price": 150, "capacity": 4, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 33, "roomNumber": "3305", "price": 200, "capacity": 5, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 34, "roomNumber": "3401", "price": 120, "capacity": 1, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 34, "roomNumber": "3402", "price": 200, "capacity": 2, "status": "Maintenance", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 34, "roomNumber": "3403", "price": 80, "capacity": 3, "status": "Occupied", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": ""},
        {"hotelId": 34, "roomNumber": "3404", "price": 80, "capacity": 4, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 34, "roomNumber": "3405", "price": 220, "capacity": 5, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Loose doorknob"},
        {"hotelId": 35, "roomNumber": "3501", "price": 150, "capacity": 1, "status": "Available", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 35, "roomNumber": "3502", "price": 200, "capacity": 2, "status": "Maintenance", "view": "None", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Bathroom plumbing"},
        {"hotelId": 35, "roomNumber": "3503", "price": 200, "capacity": 3, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": ""},
        {"hotelId": 35, "roomNumber": "3504", "price": 120, "capacity": 4, "status": "Available", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 35, "roomNumber": "3505", "price": 220, "capacity": 5, "status": "Maintenance", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 36, "roomNumber": "3601", "price": 150, "capacity": 1, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 36, "roomNumber": "3602", "price": 100, "capacity": 2, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": ""},
        {"hotelId": 36, "roomNumber": "3603", "price": 120, "capacity": 3, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 36, "roomNumber": "3604", "price": 200, "capacity": 4, "status": "Occupied", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 36, "roomNumber": "3605", "price": 120, "capacity": 5, "status": "Available", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV", "damages": "Minor scratch on table"},
        {"hotelId": 37, "roomNumber": "3701", "price": 150, "capacity": 1, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 37, "roomNumber": "3702", "price": 120, "capacity": 2, "status": "Occupied", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 37, "roomNumber": "3703", "price": 220, "capacity": 3, "status": "Maintenance", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 37, "roomNumber": "3704", "price": 100, "capacity": 4, "status": "Maintenance", "view": "None", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 37, "roomNumber": "3705", "price": 100, "capacity": 5, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 38, "roomNumber": "3801", "price": 150, "capacity": 1, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": ""},
        {"hotelId": 38, "roomNumber": "3802", "price": 200, "capacity": 2, "status": "Occupied", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": ""},
        {"hotelId": 38, "roomNumber": "3803", "price": 80, "capacity": 3, "status": "Available", "view": "Mountain", "extendable": "Yes", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 38, "roomNumber": "3804", "price": 100, "capacity": 4, "status": "Available", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Stained carpet"},
        {"hotelId": 38, "roomNumber": "3805", "price": 120, "capacity": 5, "status": "Occupied", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Stained carpet"},
        {"hotelId": 39, "roomNumber": "3901", "price": 100, "capacity": 1, "status": "Occupied", "view": "None", "extendable": "No", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 39, "roomNumber": "3902", "price": 150, "capacity": 2, "status": "Maintenance", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 39, "roomNumber": "3903", "price": 150, "capacity": 3, "status": "Occupied", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar, Jacuzzi", "damages": "Bathroom plumbing"},
        {"hotelId": 39, "roomNumber": "3904", "price": 120, "capacity": 4, "status": "Maintenance", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Minor scratch on table"},
        {"hotelId": 39, "roomNumber": "3905", "price": 80, "capacity": 5, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Stained carpet"},
        {"hotelId": 40, "roomNumber": "4001", "price": 80, "capacity": 1, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Bathroom plumbing"},
        {"hotelId": 40, "roomNumber": "4002", "price": 120, "capacity": 2, "status": "Occupied", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 40, "roomNumber": "4003", "price": 200, "capacity": 3, "status": "Maintenance", "view": "Mountain", "extendable": "No", "amenities": "WiFi, TV", "damages": "Loose doorknob"},
        {"hotelId": 40, "roomNumber": "4004", "price": 200, "capacity": 4, "status": "Occupied", "view": "Sea", "extendable": "Yes", "amenities": "WiFi, TV, Minibar", "damages": "Loose doorknob"},
        {"hotelId": 40, "roomNumber": "4005", "price": 80, "capacity": 5, "status": "Occupied", "view": "Sea", "extendable": "No", "amenities": "WiFi, TV", "damages": "Minor scratch on table"}
    ]
  
    rooms.forEach(room => {
      db.run(`INSERT INTO Room (hotelId, roomNumber, price, capacity, status, view, extendable, amenities, damages) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [room.hotelId, room.roomNumber, room.price, room.capacity, room.status, room.view, room.extendable, room.amenities, room.damages], function(err) {
        if (err) console.error("Error inserting room: ", err.message);
        else console.log(`Room inserted with ID: ${this.lastID}`);
      });
  });
};
  

// Execute a series of SQL statements to create tables
const initTables = (callback) => {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Connected to the hotel management database.');
        }
      });

    dropTables(db);

  db.serialize(() => {
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS HotelChain (
      id INTEGER PRIMARY KEY,
      address TEXT NOT NULL,
      numberOfHotels INTEGER NOT NULL,
      emailAddress TEXT NOT NULL,
      phoneNumber TEXT NOT NULL
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Hotel (
      id INTEGER PRIMARY KEY,
      hotelChainId INTEGER NOT NULL,
      name TEXT NOT NULL,
      stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      numberOfRooms INTEGER NOT NULL,
      emailAddress TEXT NOT NULL,
      phoneNumber TEXT NOT NULL,
      manager TEXT NOT NULL,
      FOREIGN KEY (hotelChainId) REFERENCES HotelChain(id)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Room (
      roomNumber TEXT NOT NULL,
      price INTEGER NOT NULL,
      capacity INTEGER NOT NULL,
      status TEXT NOT NULL,
      view TEXT NOT NULL,
      extendable TEXT NOT NULL,
      amenities TEXT,
      damages TEXT,
      hotelId INTEGER NOT NULL,
      PRIMARY KEY (roomNumber, hotelId),
      FOREIGN KEY (hotelId) REFERENCES Hotel(id)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Person (
        id INTEGER PRIMARY KEY,
        firstName TEXT NOT NULL CHECK (length(firstName) > 0),
        lastName TEXT NOT NULL CHECK (length(lastName) > 0),
        address TEXT NOT NULL
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS Employee (
        SIN TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        personID INTEGER NOT NULL,
        positions TEXT,
        hotelId INTEGER NOT NULL,
        FOREIGN KEY (personID) REFERENCES Person(id),
        FOREIGN KEY (hotelId) REFERENCES Hotel(id)
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS Manager (
        personID INTEGER PRIMARY KEY,
        employeeSIN TEXT NOT NULL,
        hotelId INTEGER NOT NULL,
        FOREIGN KEY (personID) REFERENCES Person(id),
        FOREIGN KEY (employeeSIN) REFERENCES Employee(SIN),
        FOREIGN KEY (hotelId) REFERENCES Hotel(id)
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS Customer (
        id INTEGER PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        hotelId INTEGER,
        dateOfRegistration DATE NOT NULL,
        personID INTEGER NOT NULL,
        FOREIGN KEY (hotelId) REFERENCES Hotel(id),
        FOREIGN KEY (personID) REFERENCES Person(id)
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS Payment (
        id INTEGER PRIMARY KEY,
        bookingID INTEGER NOT NULL,
        amount FLOAT NOT NULL CHECK (amount >= 0),
        paymentDate DATE NOT NULL,
        hotelId INTEGER NOT NULL,
        FOREIGN KEY (bookingID) REFERENCES Books(id),
        FOREIGN KEY (hotelId) REFERENCES Hotel(id)
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS Books (
        id INTEGER PRIMARY KEY,
        customerID INTEGER NOT NULL,
        hotelId INTEGER NOT NULL,
        roomNumber TEXT NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        paymentID INTEGER,
        checkIn BOOL DEFAULT False,
        FOREIGN KEY (customerID) REFERENCES Customer(id),
        FOREIGN KEY (roomNumber) REFERENCES Room(roomNumber),
        FOREIGN KEY (paymentID) REFERENCES Payment(id)
      );`);

      db.run(`CREATE TABLE IF NOT EXISTS Search (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerId INTEGER NOT NULL,
        hotelId INTEGER NOT NULL,
        startDate DATE NOT NULL CHECK (startDate >= date('now')),
        endDate DATE NOT NULL CHECK (endDate > startDate),
        FOREIGN KEY (customerId) REFERENCES Customer(id),
        FOREIGN KEY (hotelId) REFERENCES Hotel(id)
      );`);

      db.run(`
          CREATE TRIGGER IF NOT EXISTS delete_rooms_trigger
          AFTER DELETE ON Hotel
          FOR EACH ROW
          BEGIN
              DELETE FROM Room WHERE hotelId = OLD.id;
          END;
      `);

      db.run(`
          CREATE TRIGGER IF NOT EXISTS delete_hotels_trigger
          AFTER DELETE ON HotelChain
          FOR EACH ROW
          BEGIN
              DELETE FROM Hotel WHERE hotelChainId = OLD.id;
          END;
      `);
      
      // db.run(`CREATE TABLE IF NOT EXISTS CheckIn (
      //   id INTEGER PRIMARY KEY AUTOINCREMENT,
      //   bookingID INTEGER NOT NULL,
      //   employeeSIN TEXT NOT NULL,
      //   checkInDate DATE NOT NULL CHECK (checkInDate >= date('now')),
      //   customerID INTEGER NOT NULL,
      //   FOREIGN KEY (bookingID) REFERENCES Books(id),
      //   FOREIGN KEY (employeeSIN) REFERENCES Employee(SIN),
      //   FOREIGN KEY (customerID) REFERENCES Customer(id)
      // );`);

      db.run(`CREATE INDEX IF NOT EXISTS idx_customer_id ON Customer(id);`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_hotel_id ON Hotel(id);`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_room_hotel_id ON Room(hotelId);`);
        

      db.run(`CREATE TABLE IF NOT EXISTS BookingArchive (
        ArchiveID INTEGER PRIMARY KEY AUTOINCREMENT,
        OriginalBookingID INTEGER NOT NULL,
        CustomerID INTEGER,
        HotelID INTEGER,
        RoomNumber TEXT NOT NULL,
        StartDate DATE NOT NULL,
        EndDate DATE NOT NULL,
        PaymentID INTEGER,
        CheckIn BOOLEAN,
        ArchivedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (OriginalBookingID) REFERENCES Books(id),
        FOREIGN KEY (CustomerID) REFERENCES Customer(id),
        FOREIGN KEY (HotelID) REFERENCES Hotel(id),
        FOREIGN KEY (PaymentID) REFERENCES Payment(id)
      );`, function(err) {
        if (err) console.log(err.message);
        else {
            console.log("Last table created");
            // Now start inserting initial data
            insertHotelChains(db);
            insertHotels(db);
            insertRooms(db);
            insertBookings(db);
            insertPayments(db);
            insertCustomers(db);
            insertPersons(db);
            insertEmployees(db);
            // Ensure you manage these calls correctly, maybe chaining them to ensure order, if necessary.
        }
    });

    // Again, add more index creation statements here as needed.

    if (typeof callback === 'function') {
        callback(db);
    }
  });
};

// // Initialize the tables
// initTables();

// // Close the database connection when all queries are done
// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//     console.log('Close the database connection.');
//   }
// });

module.exports = { initTables };
