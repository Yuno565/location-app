const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Génération de la galerie photos complète (10 voitures + Villes)...");

  db.query("CREATE DATABASE IF NOT EXISTS location_db", (err) => {
    if (err) throw err;
    db.query("USE location_db", (err) => {
      if (err) throw err;

      db.query("DROP TABLE IF EXISTS vehicle_images", () => {
        db.query("DROP TABLE IF EXISTS reservations", () => {
          db.query("DROP TABLE IF EXISTS vehicles", () => {
            db.query("DROP TABLE IF EXISTS users", () => {
              
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

              const createImages = `
                CREATE TABLE vehicle_images (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  vehicle_id VARCHAR(50),
                  url TEXT NOT NULL,
                  is_main BOOLEAN DEFAULT FALSE,
                  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
                )
              `;

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

              db.query(createUsers, () => {
                db.query(createVehicles, () => {
                  db.query(createImages, () => {
                    db.query(createReservations, () => {
                      seedFullData(db);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

function seedFullData(db) {
  const password = "pass123";
  const users = [
    ['Mohammed Admin', 'admin@marocauto.ma', password, 'admin', null],
    ['Youssef Client', 'client@email.ma', password, 'client', null],
    ['Responsable AutoLux', 'agence@autolux.ma', password, 'agency', 'AutoLux Casablanca'],
    ['Manager PremiumCar', 'agence@premium.ma', password, 'agency', 'PremiumCar Marrakech']
  ];
  
  db.query("INSERT INTO users (name, email, password, role, agency_name) VALUES ?", [users], () => {
    
    const vehicles = [
      ["v1", "Mercedes-Benz", "Classe C 220d", 2023, 850, "Casablanca", "Berline", "Automatique", "Diesel", 5, "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mercedes-Benz_W206_Front-view.jpg/1200px-Mercedes-Benz_W206_Front-view.jpg", "L'élégance pure combinée à une technologie de pointe.", true, "AutoLux Casablanca"],
      ["v2", "BMW", "X5 xDrive40d", 2023, 1200, "Marrakech", "SUV", "Automatique", "Diesel", 7, "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/BMW_X5_G05_IMG_1495.jpg/1200px-BMW_X5_G05_IMG_1495.jpg", "Puissance et confort pour vos aventures marocaines.", true, "PremiumCar Marrakech"],
      ["v3", "Dacia", "Sandero Stepway", 2022, 250, "Agadir", "Économique", "Manuelle", "Essence", 5, "https://images.caradisiac.com/logos/3/8/3/6/263836/S8-essai-dacia-sandero-stepway-2021-le-choix-malin-187126.jpg", "Le choix malin pour explorer la côte en toute simplicité.", true, "EcoCar Agadir"],
      ["v4", "Range Rover", "Sport HSE", 2024, 2500, "Marrakech", "Luxe", "Automatique", "Hybride", 5, "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Range_Rover_Sport_L461_Front_View.jpg/1200px-Range_Rover_Sport_L461_Front_View.jpg", "Le luxe tout-terrain par excellence.", true, "PremiumCar Marrakech"],
      ["v5", "Audi", "A6 Sedan", 2023, 900, "Casablanca", "Berline", "Automatique", "Diesel", 5, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Audi_A6_C8_Front-view.jpg/1200px-Audi_A6_C8_Front-view.jpg", "Raffinement et dynamisme pour vos déplacements d'affaires.", true, "AutoLux Casablanca"],
      ["v6", "Porsche", "911 Carrera", 2024, 4500, "Marrakech", "Luxe", "Automatique", "Essence", 2, "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Porsche_911_Carrera_4S_992_Front_View.jpg/1200px-Porsche_911_Carrera_4S_992_Front_View.jpg", "L'icône du sport automobile à votre disposition.", true, "PremiumCar Marrakech"],
      ["v7", "Volkswagen", "Golf 8 R-Line", 2023, 550, "Tanger", "Compacte", "Automatique", "Diesel", 5, "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Volkswagen_Golf_8_Front-view.jpg/1200px-Volkswagen_Golf_8_Front-view.jpg", "La référence des compactes, moderne et connectée.", true, "TangerDrive"],
      ["v8", "Jeep", "Wrangler Rubicon", 2023, 1100, "Agadir", "4x4", "Automatique", "Essence", 5, "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/2018_Jeep_Wrangler_Rubicon_Front.jpg/1200px-2018_Jeep_Wrangler_Rubicon_Front.jpg", "Prête pour les dunes et les sentiers battus.", true, "EcoCar Agadir"],
      ["v9", "Toyota", "Land Cruiser Prado", 2023, 1300, "Rabat", "SUV", "Automatique", "Diesel", 7, "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Toyota_Land_Cruiser_Prado_J150_Front.jpg/1200px-Toyota_Land_Cruiser_Prado_J150_Front.jpg", "Solidité et prestige pour voyager en toute sérénité.", true, "Rabat Prestige"],
      ["v10", "Tesla", "Model 3 Performance", 2024, 1500, "Casablanca", "Electrique", "Automatique", "Electrique", 5, "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2019_Tesla_Model_3_Performance_Front.jpg/1200px-2019_Tesla_Model_3_Performance_Front.jpg", "L'accélération foudroyante et le silence de l'électrique.", true, "AutoLux Casablanca"]
    ];
    
    db.query("INSERT INTO vehicles (id, brand, model, year, price_per_day, city, category, transmission, fuel_type, seats, image_url, description, available, agency_name) VALUES ?", [vehicles], () => {
      
      const images = [
        ["v1", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mercedes-Benz_W206_Front-view.jpg/1200px-Mercedes-Benz_W206_Front-view.jpg", true],
        ["v1", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Mercedes-Benz_W206_Rear-view.jpg/1200px-Mercedes-Benz_W206_Rear-view.jpg", false],
        ["v1", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Mercedes-Benz_W206_Interior.jpg/1200px-Mercedes-Benz_W206_Interior.jpg", false],
        
        ["v2", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/BMW_X5_G05_IMG_1495.jpg/1200px-BMW_X5_G05_IMG_1495.jpg", true],
        ["v2", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/BMW_X5_G05_Rear.jpg/1200px-BMW_X5_G05_Rear.jpg", false],
        ["v2", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/BMW_X5_G05_Interior.jpg/1200px-BMW_X5_G05_Interior.jpg", false],

        ["v4", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Range_Rover_Sport_L461_Front_View.jpg/1200px-Range_Rover_Sport_L461_Front_View.jpg", true],
        ["v4", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Range_Rover_Sport_L461_Rear_View.jpg/1200px-Range_Rover_Sport_L461_Rear_View.jpg", false],
        ["v4", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Range_Rover_Sport_L461_Interior.jpg/1200px-Range_Rover_Sport_L461_Interior.jpg", false],

        ["v6", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Porsche_911_Carrera_4S_992_Front_View.jpg/1200px-Porsche_911_Carrera_4S_992_Front_View.jpg", true],
        ["v6", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Porsche_911_Carrera_4S_992_Rear_View.jpg/1200px-Porsche_911_Carrera_4S_992_Rear_View.jpg", false],
        ["v6", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Porsche_911_Carrera_4S_992_Interior.jpg/1200px-Porsche_911_Carrera_4S_992_Interior.jpg", false],

        ["v10", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2019_Tesla_Model_3_Performance_Front.jpg/1200px-2019_Tesla_Model_3_Performance_Front.jpg", true],
        ["v10", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/2019_Tesla_Model_3_Performance_Rear.jpg/1200px-2019_Tesla_Model_3_Performance_Rear.jpg", false],
        ["v10", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/2019_Tesla_Model_3_Interior.jpg/1200px-2019_Tesla_Model_3_Interior.jpg", false]
      ];

      db.query("INSERT INTO vehicle_images (vehicle_id, url, is_main) VALUES ?", [images], () => {
        console.log("Galerie photos complète et structure opérationnelle !");
        db.end();
      });
    });
  });
}
