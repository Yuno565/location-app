const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connecté à MySQL pour l'initialisation...");

  // Création de la base de données
  db.query("CREATE DATABASE IF NOT EXISTS location_db", (err) => {
    if (err) throw err;
    console.log("Base de données 'location_db' prête.");

    db.query("USE location_db", (err) => {
      if (err) throw err;

      // Table Users
      const createUsers = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('client', 'admin') DEFAULT 'client'
        )
      `;

      // Table Vehicles
      const createVehicles = `
        CREATE TABLE IF NOT EXISTS vehicles (
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
        CREATE TABLE IF NOT EXISTS reservations (
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
          FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
        )
      `;

      db.query(createUsers, (err) => {
        if (err) throw err;
        console.log("Table 'users' prête.");

        db.query(createVehicles, (err) => {
          if (err) throw err;
          console.log("Table 'vehicles' prête.");

          db.query(createReservations, (err) => {
            if (err) throw err;
            console.log("Table 'reservations' prête.");

            // Seed data
            seedData(db);
          });
        });
      });
    });
  });
});

function seedData(db) {
  // Check if users exist
  db.query("SELECT COUNT(*) as count FROM users", (err, result) => {
    if (err) throw err;
    if (result[0].count === 0) {
      const users = [
        ['Mohammed El Idrissi', 'admin@marocauto.ma', 'admin123', 'admin'],
        ['Youssef El Amrani', 'client@email.ma', 'client123', 'client'],
        ['Fatima Zahra Benali', 'fatima@email.ma', 'client123', 'client']
      ];
      db.query("INSERT INTO users (name, email, password, role) VALUES ?", [users], (err) => {
        if (err) throw err;
        console.log("Utilisateurs de démo insérés.");
      });
    }
  });

  // Check if vehicles exist
  db.query("SELECT COUNT(*) as count FROM vehicles", (err, result) => {
    if (err) throw err;
    if (result[0].count === 0) {
      const vehicles = [
        ["v1", "Mercedes-Benz", "Classe C 220d", 2023, 850, "Casablanca", "Berline", "Automatique", "Diesel", 5, "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=600&h=400&fit=crop&q=80", "Berline de prestige idéale pour vos déplacements professionnels.", true, "AutoLux Casablanca"],
        ["v2", "BMW", "X5 xDrive40d", 2023, 1200, "Marrakech", "SUV", "Automatique", "Diesel", 7, "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=600&h=400&fit=crop&q=80", "SUV premium pour explorer le Maroc en toute élégance.", true, "PremiumCar Marrakech"],
        ["v3", "Dacia", "Sandero Stepway", 2022, 250, "Agadir", "Économique", "Manuelle", "Essence", 5, "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&h=400&fit=crop&q=80", "Voiture économique et fiable pour découvrir Agadir.", true, "EcoCar Agadir"],
        ["v4", "Range Rover", "Sport HSE", 2024, 2500, "Marrakech", "Luxe", "Automatique", "Hybride", 5, "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop&q=80", "L'excellence britannique pour une expérience inoubliable.", true, "LuxeDrive Marrakech"],
        ["v5", "Toyota", "Corolla Hybrid", 2023, 400, "Rabat", "Berline", "Automatique", "Hybride", 5, "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop&q=80", "Berline hybride économique et confortable.", true, "ToyotaRent Rabat"],
        ["v6", "Porsche", "Cayenne S", 2024, 3500, "Casablanca", "Sportive", "Automatique", "Essence", 5, "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=400&fit=crop&q=80", "Le SUV sportif ultime pour une conduite envoûtante.", false, "PorscheDrive Casa"],
        ["v7", "Renault", "Kangoo", 2022, 350, "Tanger", "Utilitaire", "Manuelle", "Diesel", 3, "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop&q=80", "Véhicule utilitaire polyvalent pour vos besoins professionnels.", true, "UtiliCar Tanger"],
        ["v8", "Audi", "Q7 50 TDI", 2023, 1800, "Rabat", "SUV", "Automatique", "Diesel", 7, "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=400&fit=crop&q=80", "SUV familial de luxe avec 7 places et tout le confort Audi.", true, "AudiRent Rabat"]
      ];
      db.query("INSERT INTO vehicles (id, brand, model, year, price_per_day, city, category, transmission, fuel_type, seats, image_url, description, available, agency_name) VALUES ?", [vehicles], (err) => {
        if (err) throw err;
        console.log("Véhicules de démo insérés.");
        db.end();
      });
    } else {
      db.end();
    }
  });
}
