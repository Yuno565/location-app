const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Logger middleware to display requests on the terminal
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("  Body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

// --- UPLOADS CONFIG ---
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded images as static files
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Seuls les fichiers JPEG, PNG et WebP sont acceptés."));
  },
});

// --- DATABASE ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "location_db"
});

db.connect((err) => {
  if (err) {
    console.error("Erreur connexion MySQL :", err);
  } else {
    console.log("MySQL connecté sur location_db");
  }
});

// --- ROUTES AUTH ---

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Bypass MySQL if password is "pass123" for testing the 3 spaces
  if (password === "pass123") {
    if (email === "admin@marocauto.ma") {
      return res.json({ success: true, user: { name: "Mohammed El Idrissi", email, role: "admin" } });
    }
    if (email === "agence@autolux.ma") {
      return res.json({ success: true, user: { name: "Responsable AutoLux", email, role: "agency", agency_name: "AutoLux Casablanca" } });
    }
    if (email === "client@email.ma") {
      return res.json({ success: true, user: { name: "Youssef El Amrani", email, role: "client" } });
    }
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      const user = results[0];
      res.json({ 
        success: true, 
        user: { 
          name: user.name, 
          email: user.email, 
          role: user.role,
          agency_name: user.agency_name 
        } 
      });
    } else {
      res.status(401).json({ success: false, message: "Identifiants incorrects" });
    }
  });
});

// --- ROUTES VEHICULES ---

app.get("/api/vehicles", (req, res) => {
  db.query("SELECT * FROM vehicles", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Ajouter un véhicule avec upload de photos
app.post("/api/vehicles", upload.array("photos", 5), (req, res) => {
  const { brand, model, year, price_per_day, city, category, transmission, fuel_type, seats, description, agency_name } = req.body;
  
  // Generate unique ID
  const vehicleId = "v" + Date.now();
  
  // Main image = first uploaded file, or placeholder
  const mainImageUrl = req.files && req.files.length > 0
    ? `http://localhost:5000/uploads/${req.files[0].filename}`
    : "https://via.placeholder.com/600x400?text=No+Image";
  
  const sql = `INSERT INTO vehicles 
    (id, brand, model, year, price_per_day, city, category, transmission, fuel_type, seats, image_url, description, available, agency_name) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?)`;
  
  const values = [vehicleId, brand, model, parseInt(year), parseInt(price_per_day), city, category, transmission, fuel_type, parseInt(seats), mainImageUrl, description || "", agency_name];
  
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Insert all uploaded images into vehicle_images table
    if (req.files && req.files.length > 0) {
      const imageValues = req.files.map((file, index) => [
        vehicleId,
        `http://localhost:5000/uploads/${file.filename}`,
        index === 0 // first image is main
      ]);
      
      db.query("INSERT INTO vehicle_images (vehicle_id, url, is_main) VALUES ?", [imageValues], (err) => {
        if (err) console.error("Erreur insertion images:", err.message);
        res.json({ success: true, id: vehicleId, message: "Véhicule ajouté avec succès !" });
      });
    } else {
      res.json({ success: true, id: vehicleId, message: "Véhicule ajouté (sans photos)." });
    }
  });
});

// Modifier un véhicule (avec optionnel upload de photos)
app.put("/api/vehicles/:id", upload.array("photos", 5), (req, res) => {
  const { id } = req.params;
  const { brand, model, year, price_per_day, city, category, transmission, fuel_type, seats, description, agency_name } = req.body;
  
  // 1. Mettre à jour les informations du véhicule
  let sql = `UPDATE vehicles SET brand=?, model=?, year=?, price_per_day=?, city=?, category=?, transmission=?, fuel_type=?, seats=?, description=?, agency_name=?`;
  let values = [brand, model, parseInt(year), parseInt(price_per_day), city, category, transmission, fuel_type, parseInt(seats), description || "", agency_name];
  
  // Si de nouvelles images sont uploadées, on met à jour la photo principale
  if (req.files && req.files.length > 0) {
    const mainImageUrl = `http://localhost:5000/uploads/${req.files[0].filename}`;
    sql += `, image_url=?`;
    values.push(mainImageUrl);
  }
  
  sql += ` WHERE id=?`;
  values.push(id);
  
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Si on a des nouvelles photos, on supprime les anciennes et on insère les nouvelles
    if (req.files && req.files.length > 0) {
      db.query("DELETE FROM vehicle_images WHERE vehicle_id = ?", [id], (err) => {
        if (err) console.error("Erreur suppression anciennes images:", err.message);
        
        const imageValues = req.files.map((file, index) => [
          id,
          `http://localhost:5000/uploads/${file.filename}`,
          index === 0 // first image is main
        ]);
        
        db.query("INSERT INTO vehicle_images (vehicle_id, url, is_main) VALUES ?", [imageValues], (err) => {
          if (err) console.error("Erreur insertion images:", err.message);
          res.json({ success: true, message: "Véhicule et photos modifiés avec succès !" });
        });
      });
    } else {
      res.json({ success: true, message: "Véhicule modifié avec succès !" });
    }
  });
});

// Récupérer les images d'un véhicule
app.get("/api/vehicles/:id/images", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM vehicle_images WHERE vehicle_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// --- ROUTES RESERVATIONS ---

app.get("/api/reservations", (req, res) => {
  const agencyName = req.query.agency_name;
  let sql = "SELECT * FROM reservations";
  let params = [];

  if (agencyName) {
    sql += " WHERE agency_name = ?";
    params.push(agencyName);
  }

  sql += " ORDER BY pickup_date DESC";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/reservations", (req, res) => {
  const r = req.body;
  
  // First, find the vehicle's agency
  db.query("SELECT agency_name FROM vehicles WHERE id = ?", [r.vehicle_id], (err, vResults) => {
    if (err) return res.status(500).json({ error: err.message });
    const agencyName = vResults.length > 0 ? vResults[0].agency_name : null;

    const sql = `INSERT INTO reservations 
      (id, vehicle_id, vehicle_name, customer_name, customer_email, customer_phone, pickup_city, pickup_date, return_date, total_days, total_price, payment_method, status, agency_name) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
      r.id, r.vehicle_id, r.vehicle_name, r.customer_name, r.customer_email, 
      r.customer_phone, r.pickup_city, r.pickup_date, r.return_date, 
      r.total_days, r.total_price, r.payment_method, r.status || 'En attente',
      agencyName
    ];

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: r.id });
    });
  });
});

// Update status
app.patch("/api/reservations/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.query("UPDATE reservations SET status = ? WHERE id = ?", [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Health check
app.get("/", (req, res) => {
  res.send("Backend MarocAuto Premium opérationnel sur le port 5000");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
