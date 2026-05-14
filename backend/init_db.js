const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connecté à MySQL pour l'initialisation...");

  db.query("CREATE DATABASE IF NOT EXISTS location_db", (err) => {
    if (err) throw err;
    db.query("USE location_db", (err) => {
      if (err) throw err;

      // Drop tables for clean re-init
      db.query("DROP TABLE IF EXISTS reservations", () => {
        db.query("DROP TABLE IF EXISTS vehicles", () => {
          db.query("DROP TABLE IF EXISTS users", () => {
            
            // Table Users
            const createUsers = `
              CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('client', 'admin', 'agency') DEFAULT 'client',
                agency_name VARCHAR(255) DEFAULT NULL
              )
            `;

            // Table Vehicles
            const createVehicles = `
              CREATE TABLE vehicles (
                id VARCHAR(50) PRIMARY KEY,
                brand VARCHAR(255) NOT NULL,
                model VARCHAR(255) NOT NULL,
                year INT,
                price_per_day INT,
                city VARCHAR(255),
                category VARCHAR(255),
                transmission VARCHAR(50),
                fuel_type VARCHAR(50),
                seats INT,
                image_url TEXT,
                description TEXT,
                available BOOLEAN DEFAULT TRUE,
                agency_name VARCHAR(255)
              )
            `;

            // Table Reservations
            const createReservations = `
              CREATE TABLE reservations (
                id VARCHAR(50) PRIMARY KEY,
                vehicle_id VARCHAR(50),
                vehicle_name VARCHAR(255),
                customer_name VARCHAR(255),
                customer_email VARCHAR(255),
                customer_phone VARCHAR(50),
                pickup_city VARCHAR(255),
                pickup_date DATE,
                return_date DATE,
                total_days INT,
                total_price INT,
                payment_method VARCHAR(100),
                status VARCHAR(50) DEFAULT 'En attente',
                agency_name VARCHAR(255),
                FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
              )
            `;

            db.query(createUsers, (err) => {
              if (err) throw err;
              db.query(createVehicles, (err) => {
                if (err) throw err;
                db.query(createReservations, (err) => {
                  if (err) throw err;
                  seedData(db);
                });
              });
            });
          });
        });
      });
    });
  });
});

function seedData(db) {
  const users = [
    ['Mohammed Admin', 'admin@marocauto.ma', 'admin123', 'admin', null],
    ['Youssef Client', 'client@email.ma', 'client123', 'client', null],
    ['Responsable AutoLux', 'agence@autolux.ma', 'agency123', 'agency', 'AutoLux Casablanca'],
    ['Manager PremiumCar', 'agence@premium.ma', 'agency123', 'agency', 'PremiumCar Marrakech']
  ];
  db.query("INSERT INTO users (name, email, password, role, agency_name) VALUES ?", [users], (err) => {
    if (err) throw err;
    console.log("Utilisateurs insérés.");
    
    const vehicles = [
      ["v1", "Mercedes-Benz", "Classe C 220d", 2023, 850, "Casablanca", "Berline", "Automatique", "Diesel", 5, "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=600&h=400&fit=crop&q=80", "Berline de prestige idéale pour vos déplacements professionnels.", true, "AutoLux Casablanca"],
      ["v2", "BMW", "X5 xDrive40d", 2023, 1200, "Marrakech", "SUV", "Automatique", "Diesel", 7, "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=600&h=400&fit=crop&q=80", "SUV premium pour explorer le Maroc en toute élégance.", true, "PremiumCar Marrakech"],
      ["v3", "Dacia", "Sandero Stepway", 2022, 250, "Agadir", "Économique", "Manuelle", "Essence", 5, "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&h=400&fit=crop&q=80", "Voiture économique et fiable pour découvrir Agadir.", true, "EcoCar Agadir"],
      ["v4", "Range Rover", "Sport HSE", 2024, 2500, "Marrakech", "Luxe", "Automatique", "Hybride", 5, "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop&q=80", "L'excellence britannique pour une expérience inoubliable.", true, "PremiumCar Marrakech"]
    ];
    db.query("INSERT INTO vehicles (id, brand, model, year, price_per_day, city, category, transmission, fuel_type, seats, image_url, description, available, agency_name) VALUES ?", [vehicles], (err) => {
      if (err) throw err;
      console.log("Véhicules insérés.");
      db.end();
    });
  });
}
