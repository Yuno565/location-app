const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connecté à MySQL pour réinitialisation des mots de passe...");

  db.query("USE location_db", (err) => {
    if (err) throw err;

    // Mise à jour de tous les utilisateurs avec le même mot de passe simple
    const password = "pass123";
    
    db.query("DELETE FROM users", () => {
      const users = [
        ['Mohammed Admin', 'admin@marocauto.ma', password, 'admin', null],
        ['Youssef Client', 'client@email.ma', password, 'client', null],
        ['Responsable AutoLux', 'agence@autolux.ma', password, 'agency', 'AutoLux Casablanca'],
        ['Manager PremiumCar', 'agence@premium.ma', password, 'agency', 'PremiumCar Marrakech']
      ];
      db.query("INSERT INTO users (name, email, password, role, agency_name) VALUES ?", [users], (err) => {
        if (err) throw err;
        console.log("Tous les mots de passe ont été réinitialisés sur : " + password);
        db.end();
      });
    });
  });
});
