const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Initialisation complète de la base de données (10 véhicules)...");

  db.query("CREATE DATABASE IF NOT EXISTS location_db", (err) => {
    if (err) throw err;
    db.query("USE location_db", (err) => {
      if (err) throw err;

      // Drop tables for clean start
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
  // Users (all with pass123)
  const password = "pass123";
  const users = [
    ['Mohammed Admin', 'admin@marocauto.ma', password, 'admin', null],
    ['Youssef Client', 'client@email.ma', password, 'client', null],
    ['Responsable AutoLux', 'agence@autolux.ma', password, 'agency', 'AutoLux Casablanca'],
    ['Manager PremiumCar', 'agence@premium.ma', password, 'agency', 'PremiumCar Marrakech']
  ];
  
  db.query("INSERT INTO users (name, email, password, role, agency_name) VALUES ?", [users], (err) => {
    if (err) throw err;
    console.log("Utilisateurs insérés.");
    
    // 10 Vehicles
    const vehicles = [
      ["v1", "Mercedes-Benz", "Classe C 220d", 2023, 850, "Casablanca", "Berline", "Automatique", "Diesel", 5, "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=800&q=80", "Berline de prestige idéale pour vos déplacements professionnels.", true, "AutoLux Casablanca"],
      ["v2", "BMW", "X5 xDrive40d", 2023, 1200, "Marrakech", "SUV", "Automatique", "Diesel", 7, "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=800&q=80", "SUV premium pour explorer le Maroc en toute élégance.", true, "PremiumCar Marrakech"],
      ["v3", "Dacia", "Sandero Stepway", 2022, 250, "Agadir", "Économique", "Manuelle", "Essence", 5, "https://images.caradisiac.com/logos/3/8/3/6/263836/S8-essai-dacia-sandero-stepway-2021-le-choix-malin-187126.jpg", "Voiture économique et fiable pour découvrir Agadir.", true, "EcoCar Agadir"],
      ["v4", "Range Rover", "Sport HSE", 2024, 2500, "Marrakech", "Luxe", "Automatique", "Hybride", 5, "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80", "L'excellence britannique pour une expérience inoubliable.", true, "PremiumCar Marrakech"],
      ["v5", "Audi", "A6 Sedan", 2023, 900, "Casablanca", "Berline", "Automatique", "Diesel", 5, "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80", "Confort et technologie allemande pour vos trajets urbains.", true, "AutoLux Casablanca"],
      ["v6", "Porsche", "911 Carrera", 2024, 4500, "Marrakech", "Luxe", "Automatique", "Essence", 2, "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", "La légende sportive pour des sensations fortes à Marrakech.", true, "PremiumCar Marrakech"],
      ["v7", "Volkswagen", "Golf 8 R-Line", 2023, 550, "Tanger", "Compacte", "Automatique", "Diesel", 5, "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80", "Polyvalente et moderne, parfaite pour la ville de Tanger.", true, "TangerDrive"],
      ["v8", "Jeep", "Wrangler Rubicon", 2023, 1100, "Agadir", "4x4", "Automatique", "Essence", 5, "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", "Dominez tous les terrains avec ce 4x4 mythique.", true, "EcoCar Agadir"],
      ["v9", "Toyota", "Land Cruiser Prado", 2023, 1300, "Rabat", "SUV", "Automatique", "Diesel", 7, "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800&q=80", "Le roi de la route pour vos voyages en famille.", true, "Rabat Prestige"],
      ["v10", "Tesla", "Model 3 Performance", 2024, 1500, "Casablanca", "Electrique", "Automatique", "Electrique", 5, "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80", "Vivez le futur de la conduite avec cette Tesla surpuissante.", true, "AutoLux Casablanca"]
    ];
    
    db.query("INSERT INTO vehicles (id, brand, model, year, price_per_day, city, category, transmission, fuel_type, seats, image_url, description, available, agency_name) VALUES ?", [vehicles], (err) => {
      if (err) throw err;
      console.log("Catalogue de 10 véhicules inséré !");
      db.end();
    });
  });
}
