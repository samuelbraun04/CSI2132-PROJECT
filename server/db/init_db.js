const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Connected to the SQLite database.');
});

// Helper function to run SQL
const runSql = (sql) => {
    return new Promise((resolve, reject) => {
        db.run(sql, function(err) {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

// Serialize ensures that the queries are executed in the correct order
db.serialize(async () => {
    try {
        // Create tables
        await runSql(`CREATE TABLE IF NOT EXISTS HotelChain (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT,
            numberOfHotels INTEGER,
            emailAddress TEXT,
            phoneNumber TEXT
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Hotel (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hotelChainID INTEGER,
            name TEXT NOT NULL,
            stars INTEGER,
            address TEXT NOT NULL,
            numberOfRooms INTEGER,
            emailAddress TEXT,
            phoneNumber TEXT,
            FOREIGN KEY (hotelChainID) REFERENCES HotelChain (id)
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Room (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hotelID INTEGER,
            roomNumber TEXT NOT NULL,
            price REAL,
            capacity INTEGER,
            status TEXT,
            view TEXT,
            extendable BOOLEAN,
            amenities TEXT,
            damages TEXT,
            FOREIGN KEY (hotelID) REFERENCES Hotel (id)
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Person (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            address TEXT NOT NULL
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Employee (
            SIN INTEGER PRIMARY KEY,
            personID INTEGER,
            positions TEXT,
            hotelID INTEGER,
            FOREIGN KEY (personID) REFERENCES Person (id),
            FOREIGN KEY (hotelID) REFERENCES Hotel (id)
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Manager (
            personID INTEGER PRIMARY KEY,
            employeeSIN INTEGER,
            hotelID INTEGER,
            FOREIGN KEY (personID) REFERENCES Person (id),
            FOREIGN KEY (employeeSIN) REFERENCES Employee (SIN),
            FOREIGN KEY (hotelID) REFERENCES Hotel (id)
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Customer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hotelID INTEGER,
            dateOfRegistration DATE,
            personID INTEGER,
            paymentID INTEGER,
            FOREIGN KEY (hotelID) REFERENCES Hotel (id),
            FOREIGN KEY (personID) REFERENCES Person (id)
            -- Assuming Payment Table is created later and will add FOREIGN KEY for paymentID.
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customerID INTEGER,
            roomNumber TEXT,
            startDate DATE,
            endDate DATE,
            FOREIGN KEY (customerID) REFERENCES Customer (id)
            -- Assuming Room Table has roomNumber and will add FOREIGN KEY for roomNumber.
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Check_In (
            bookingID INTEGER PRIMARY KEY,
            employeeSIN INTEGER,
            checkInDate DATE,
            customerID INTEGER,
            FOREIGN KEY (bookingID) REFERENCES Books (id),
            FOREIGN KEY (employeeSIN) REFERENCES Employee (SIN),
            FOREIGN KEY (customerID) REFERENCES Customer (id)
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Payment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookingID INTEGER,
            amount REAL,
            paymentDate DATE,
            hotelID INTEGER,
            FOREIGN KEY (bookingID) REFERENCES Books (id),
            FOREIGN KEY (hotelID) REFERENCES Hotel (id)
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Search (
            customerID INTEGER,
            hotelID INTEGER,
            startDate DATE,
            endDate DATE,
            FOREIGN KEY (customerID) REFERENCES Customer (id),
            FOREIGN KEY (hotelID) REFERENCES Hotel (id)
        )`);

        await runSql(`CREATE TABLE IF NOT EXISTS Change_Status (
            status TEXT,
            roomNumber TEXT,
            employeeSIN INTEGER,
            FOREIGN KEY (roomNumber) REFERENCES Room (roomNumber),
            FOREIGN KEY (employeeSIN) REFERENCES Employee (SIN)
        )`);

        // Insert Sample Data into HotelChain
        const hotelChainInsert = db.prepare(`INSERT INTO HotelChain (name, address, numberOfHotels, emailAddress, phoneNumber) VALUES (?, ?, ?, ?, ?)`);
        for (let i = 1; i <= 5; i++) {
            hotelChainInsert.run(`Chain ${i}`, `Address ${i}`, 8, `email${i}@chain.com`, `phone${i}`);
        }
        hotelChainInsert.finalize();

        // ... continue with inserting data for other tables as necessary ...

    } catch (err) {
        console.error(err);
    } finally {
        // Close the database connection
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }
});
