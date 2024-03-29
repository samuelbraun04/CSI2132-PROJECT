const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'hotel_database.db');

const dropTables = (db) => {
    db.serialize(() => {
        // Drop tables in reverse order of dependency
        const tables = ['ChangeStatus', 'CheckIn', 'Search', 'Books', 'Payment', 'Customer', 'Employee', 'Manager', 'Room', 'Hotel', 'HotelChain'];
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

const createTriggers = (db) => {
    // Example: Trigger for updating room status after booking
    db.run(`CREATE TRIGGER UpdateRoomStatusAfterBooking
            AFTER INSERT ON Books
            FOR EACH ROW
            BEGIN
              UPDATE Room SET status = 'Occupied'
              WHERE roomNumber = NEW.roomNumber
              AND hotelId = (SELECT hotelID FROM Customer WHERE id = NEW.customerID);
            END;`);
  
    // Example: Trigger for deleting rooms after a hotel is deleted
    db.run(`CREATE TRIGGER DeleteRoomsAfterHotelDeletion
            AFTER DELETE ON Hotel
            FOR EACH ROW
            BEGIN
              DELETE FROM Room WHERE hotelId = OLD.id;
            END;`);
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

  
const insertHotels = (db) => {
    const hotels = [
        { hotelChainId: 1, name: 'Hotel A1', stars: 5, address: '100 Main St, City A, NA', numberOfRooms: 5, emailAddress: 'contact@hotela1.com', phoneNumber: '100-100-1000' },
        { hotelChainId: 1, name: 'Hotel A2', stars: 4, address: '101 Main St, City A, NA', numberOfRooms: 5, emailAddress: 'info@hotela2.com', phoneNumber: '100-100-1001' },
        { hotelChainId: 1, name: 'Hotel A3', stars: 3, address: '102 Main St, City B, NA', numberOfRooms: 5, emailAddress: 'support@hotela3.com', phoneNumber: '100-100-1002' },
        { hotelChainId: 1, name: 'Hotel A4', stars: 4, address: '103 Main St, City B, NA', numberOfRooms: 5, emailAddress: 'contact@hotela4.com', phoneNumber: '100-100-1003' },
        { hotelChainId: 1, name: 'Hotel A5', stars: 3, address: '104 Main St, City C, NA', numberOfRooms: 5, emailAddress: 'info@hotela5.com', phoneNumber: '100-100-1004' },
        { hotelChainId: 1, name: 'Hotel A6', stars: 4, address: '105 Main St, City C, NA', numberOfRooms: 5, emailAddress: 'support@hotela6.com', phoneNumber: '100-100-1005' },
        { hotelChainId: 1, name: 'Hotel A7', stars: 3, address: '106 Main St, City D, NA', numberOfRooms: 5, emailAddress: 'contact@hotela7.com', phoneNumber: '100-100-1006' },
        { hotelChainId: 1, name: 'Hotel A8', stars: 5, address: '107 Main St, City D, NA', numberOfRooms: 5, emailAddress: 'info@hotela8.com', phoneNumber: '100-100-1007' },

        // Hotel Chain 2
        { hotelChainId: 2, name: 'Hotel B1', stars: 5, address: '200 Main St, City E, NA', numberOfRooms: 5, emailAddress: 'contact@hotelb1.com', phoneNumber: '200-200-2000' },
        { hotelChainId: 2, name: 'Hotel B2', stars: 4, address: '201 Main St, City E, NA', numberOfRooms: 5, emailAddress: 'info@hotelb2.com', phoneNumber: '200-200-2001' },
        { hotelChainId: 2, name: 'Hotel B3', stars: 3, address: '202 Main St, City F, NA', numberOfRooms: 5, emailAddress: 'support@hotelb3.com', phoneNumber: '200-200-2002' },
        { hotelChainId: 2, name: 'Hotel B4', stars: 4, address: '203 Main St, City F, NA', numberOfRooms: 5, emailAddress: 'contact@hotelb4.com', phoneNumber: '200-200-2003' },
        { hotelChainId: 2, name: 'Hotel B5', stars: 3, address: '204 Main St, City G, NA', numberOfRooms: 5, emailAddress: 'info@hotelb5.com', phoneNumber: '200-200-2004' },
        { hotelChainId: 2, name: 'Hotel B6', stars: 4, address: '205 Main St, City G, NA', numberOfRooms: 5, emailAddress: 'support@hotelb6.com', phoneNumber: '200-200-2005' },
        { hotelChainId: 2, name: 'Hotel B7', stars: 3, address: '206 Main St, City H, NA', numberOfRooms: 5, emailAddress: 'contact@hotelb7.com', phoneNumber: '200-200-2006' },
        { hotelChainId: 2, name: 'Hotel B8', stars: 5, address: '207 Main St, City H, NA', numberOfRooms: 5, emailAddress: 'info@hotelb8.com', phoneNumber: '200-200-2007' },

        // Hotel Chain 3
        { hotelChainId: 3, name: 'Hotel C1', stars: 5, address: '300 Main St, City I, NA', numberOfRooms: 5, emailAddress: 'contact@hotelc1.com', phoneNumber: '300-300-3000' },
        { hotelChainId: 3, name: 'Hotel C2', stars: 4, address: '301 Main St, City I, NA', numberOfRooms: 5, emailAddress: 'info@hotelc2.com', phoneNumber: '300-300-3001' },
        { hotelChainId: 3, name: 'Hotel C3', stars: 3, address: '302 Main St, City J, NA', numberOfRooms: 5, emailAddress: 'support@hotelc3.com', phoneNumber: '300-300-3002' },
        { hotelChainId: 3, name: 'Hotel C4', stars: 4, address: '303 Main St, City J, NA', numberOfRooms: 5, emailAddress: 'contact@hotelc4.com', phoneNumber: '300-300-3003' },
        { hotelChainId: 3, name: 'Hotel C5', stars: 3, address: '304 Main St, City K, NA', numberOfRooms: 5, emailAddress: 'info@hotelc5.com', phoneNumber: '300-300-3004' },
        { hotelChainId: 3, name: 'Hotel C6', stars: 4, address: '305 Main St, City K, NA', numberOfRooms: 5, emailAddress: 'support@hotelc6.com', phoneNumber: '300-300-3005' },
        { hotelChainId: 3, name: 'Hotel C7', stars: 3, address: '306 Main St, City L, NA', numberOfRooms: 5, emailAddress: 'contact@hotelc7.com', phoneNumber: '300-300-3006' },
        { hotelChainId: 3, name: 'Hotel C8', stars: 5, address: '307 Main St, City L, NA', numberOfRooms: 5, emailAddress: 'info@hotelc8.com', phoneNumber: '300-300-3007' },

        { hotelChainId: 4, name: 'Hotel D1', stars: 5, address: '400 Main St, City M, NA', numberOfRooms: 5, emailAddress: 'contact@hoteld1.com', phoneNumber: '400-400-4000' },
        { hotelChainId: 4, name: 'Hotel D2', stars: 4, address: '401 Main St, City N, NA', numberOfRooms: 5, emailAddress: 'info@hoteld2.com', phoneNumber: '400-400-4001' },
        { hotelChainId: 4, name: 'Hotel D3', stars: 3, address: '402 Main St, City O, NA', numberOfRooms: 5, emailAddress: 'support@hoteld3.com', phoneNumber: '400-400-4002' },
        { hotelChainId: 4, name: 'Hotel D4', stars: 4, address: '403 Main St, City P, NA', numberOfRooms: 5, emailAddress: 'contact@hoteld4.com', phoneNumber: '400-400-4003' },
        { hotelChainId: 4, name: 'Hotel D5', stars: 3, address: '404 Main St, City Q, NA', numberOfRooms: 5, emailAddress: 'info@hoteld5.com', phoneNumber: '400-400-4004' },
        { hotelChainId: 4, name: 'Hotel D6', stars: 4, address: '405 Main St, City R, NA', numberOfRooms: 5, emailAddress: 'support@hoteld6.com', phoneNumber: '400-400-4005' },
        { hotelChainId: 4, name: 'Hotel D7', stars: 3, address: '406 Main St, City S, NA', numberOfRooms: 5, emailAddress: 'contact@hoteld7.com', phoneNumber: '400-400-4006' },
        { hotelChainId: 4, name: 'Hotel D8', stars: 5, address: '407 Main St, City T, NA', numberOfRooms: 5, emailAddress: 'info@hoteld8.com', phoneNumber: '400-400-4007' },

        // Hotel Chain 5
        { hotelChainId: 5, name: 'Hotel E1', stars: 5, address: '500 Main St, City U, NA', numberOfRooms: 5, emailAddress: 'contact@hotele1.com', phoneNumber: '500-500-5000' },
        { hotelChainId: 5, name: 'Hotel E2', stars: 4, address: '501 Main St, City V, NA', numberOfRooms: 5, emailAddress: 'info@hotele2.com', phoneNumber: '500-500-5001' },
        { hotelChainId: 5, name: 'Hotel E3', stars: 3, address: '502 Main St, City W, NA', numberOfRooms: 5, emailAddress: 'support@hotele3.com', phoneNumber: '500-500-5002' },
        { hotelChainId: 5, name: 'Hotel E4', stars: 4, address: '503 Main St, City X, NA', numberOfRooms: 5, emailAddress: 'contact@hotele4.com', phoneNumber: '500-500-5003' },
        { hotelChainId: 5, name: 'Hotel E5', stars: 3, address: '504 Main St, City Y, NA', numberOfRooms: 5, emailAddress: 'info@hotele5.com', phoneNumber: '500-500-5004' },
        { hotelChainId: 5, name: 'Hotel E6', stars: 4, address: '505 Main St, City Z, NA', numberOfRooms: 5, emailAddress: 'support@hotele6.com', phoneNumber: '500-500-5005' },
        { hotelChainId: 5, name: 'Hotel E7', stars: 3, address: '506 Main St, City AA, NA', numberOfRooms: 5, emailAddress: 'contact@hotele7.com', phoneNumber: '500-500-5006' },
        { hotelChainId: 5, name: 'Hotel E8', stars: 5, address: '507 Main St, City AB, NA', numberOfRooms: 5, emailAddress: 'info@hotele8.com', phoneNumber: '500-500-5007' }
    ];
  
    hotels.forEach(hotel => {
      db.run(`INSERT INTO Hotel (hotelChainId, name, stars, address, numberOfRooms, emailAddress, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [hotel.hotelChainId, hotel.name, hotel.stars, hotel.address, hotel.numberOfRooms, hotel.emailAddress, hotel.phoneNumber], function(err) {
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
      address TEXT NOT NULL CHECK (address LIKE '%, NA'),
      numberOfHotels INTEGER NOT NULL CHECK (numberOfHotels > 0),
      emailAddress TEXT NOT NULL CHECK (emailAddress LIKE '%@%'),
      phoneNumber TEXT NOT NULL CHECK (phoneNumber LIKE '%-%-%')
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Hotel (
      id INTEGER PRIMARY KEY,
      hotelChainId INTEGER NOT NULL,
      name TEXT NOT NULL,
      stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
      address TEXT NOT NULL CHECK (address LIKE '%, NA'),
      numberOfRooms INTEGER NOT NULL CHECK (numberOfRooms > 0),
      emailAddress TEXT NOT NULL CHECK (emailAddress LIKE '%@%'),
      phoneNumber TEXT NOT NULL CHECK (phoneNumber LIKE '%-%-%'),
      FOREIGN KEY (hotelChainId) REFERENCES HotelChain(id)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Room (
      roomNumber TEXT NOT NULL,
      price FLOAT NOT NULL CHECK (price >= 0),
      capacity INTEGER NOT NULL CHECK (capacity > 0),
      status TEXT NOT NULL CHECK (status IN ('Available', 'Occupied', 'Maintenance', 'Cleaning')),
      view TEXT NOT NULL CHECK (view IN ('Sea', 'Mountain', 'None')),
      extendable TEXT NOT NULL CHECK (extendable IN ('Yes', 'No')),
      amenities TEXT, -- Consider creating a separate table for amenities
      damages TEXT, -- Consider creating a separate table for damages
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
        personID INTEGER NOT NULL,
        positions TEXT CHECK (positions IN ('Manager', 'Receptionist', 'Housekeeper', 'Chef', 'Other')), -- Add all possible positions here
        hotelID INTEGER NOT NULL,
        FOREIGN KEY (personID) REFERENCES Person(id),
        FOREIGN KEY (hotelID) REFERENCES Hotel(id)
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS Manager (
        personID INTEGER PRIMARY KEY,
        employeeSIN TEXT NOT NULL,
        hotelID INTEGER NOT NULL,
        FOREIGN KEY (personID) REFERENCES Person(id),
        FOREIGN KEY (employeeSIN) REFERENCES Employee(SIN),
        FOREIGN KEY (hotelID) REFERENCES Hotel(id)
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS Customer (
        id INTEGER PRIMARY KEY,
        hotelID INTEGER,
        dateOfRegistration DATE NOT NULL,
        personID INTEGER NOT NULL,
        paymentID INTEGER,
        FOREIGN KEY (hotelID) REFERENCES Hotel(id),
        FOREIGN KEY (personID) REFERENCES Person(id),
        FOREIGN KEY (paymentID) REFERENCES Payment(id)
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS Payment (
        id INTEGER PRIMARY KEY,
        bookingID INTEGER NOT NULL,
        amount FLOAT NOT NULL CHECK (amount >= 0),
        paymentDate DATE NOT NULL,
        hotelID INTEGER NOT NULL,
        FOREIGN KEY (bookingID) REFERENCES Books(id),
        FOREIGN KEY (hotelID) REFERENCES Hotel(id)
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS Books (
        id INTEGER PRIMARY KEY,
        customerID INTEGER NOT NULL,
        roomNumber TEXT NOT NULL,
        startDate DATE NOT NULL CHECK (startDate >= date('now')),
        endDate DATE NOT NULL CHECK (endDate > startDate),
        FOREIGN KEY (customerID) REFERENCES Customer(id),
        FOREIGN KEY (roomNumber) REFERENCES Room(roomNumber)
      );`);

      db.run(`CREATE TABLE IF NOT EXISTS Search (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerId INTEGER NOT NULL,
        hotelID INTEGER NOT NULL,
        startDate DATE NOT NULL CHECK (startDate >= date('now')),
        endDate DATE NOT NULL CHECK (endDate > startDate),
        FOREIGN KEY (customerId) REFERENCES Customer(id),
        FOREIGN KEY (hotelID) REFERENCES Hotel(id)
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS CheckIn (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookingID INTEGER NOT NULL,
        employeeSIN TEXT NOT NULL,
        checkInDate DATE NOT NULL CHECK (checkInDate >= date('now')),
        customerID INTEGER NOT NULL,
        FOREIGN KEY (bookingID) REFERENCES Books(id),
        FOREIGN KEY (employeeSIN) REFERENCES Employee(SIN),
        FOREIGN KEY (customerID) REFERENCES Customer(id)
      );`);
      
      db.run(`CREATE TABLE IF NOT EXISTS ChangeStatus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roomNumber TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('Available', 'Occupied', 'Maintenance', 'Cleaning')),
        employeeSIN TEXT NOT NULL,
        changeDate DATE NOT NULL CHECK (changeDate >= date('now')),
        hotelID INTEGER NOT NULL,
        FOREIGN KEY (roomNumber, hotelID) REFERENCES Room(roomNumber, hotelId),
        FOREIGN KEY (employeeSIN) REFERENCES Employee(SIN),
        FOREIGN KEY (hotelID) REFERENCES Hotel(id)
      );`, function(err) {
        if (err) console.log(err.message);
        else {
            console.log("Last table created");
            // Now start inserting initial data
            insertHotelChains(db);
            insertHotels(db);
            insertRooms(db);
            // Ensure you manage these calls correctly, maybe chaining them to ensure order, if necessary.
        }
    });


    // // After creating all tables, create indexes
    // db.run(`CREATE INDEX IF NOT EXISTS idx_hotel ON Room(hotelId);`);
    // db.run(`CREATE INDEX IF NOT EXISTS idx_status ON Room(status);`);
    // db.run(`CREATE INDEX IF NOT EXISTS idx_price ON Room(price);`);

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
