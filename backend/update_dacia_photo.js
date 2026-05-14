const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Mise à jour de la photo Dacia...");

  db.query("USE location_db", (err) => {
    if (err) throw err;

    // Nouvelle URL pour la Dacia Sandero Stepway Orange (similaire à la photo fournie)
    const newImageUrl = "https://images.caradisiac.com/logos/3/8/3/6/263836/S8-essai-dacia-sandero-stepway-2021-le-choix-malin-187126.jpg";

    db.query("UPDATE vehicles SET image_url = ? WHERE id = 'v3'", [newImageUrl], (err) => {
      if (err) throw err;
      console.log("Photo Dacia mise à jour avec succès !");
      db.end();
    });
  });
});
