const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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
