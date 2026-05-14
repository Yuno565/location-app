const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "location_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Mise à jour des photos réelles (Google/Wikimedia)...");

  // ─── VILLES (HomePage) ────────────────────────────────────────────
  // Ces URLs sont stables et vérifiées

  // ─── VÉHICULES ────────────────────────────────────────────────────
  const updates = [
    // Mercedes-Benz Classe C 220d (W206) — Vue 3/4 avant officielle
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/2022_Mercedes-Benz_C-class_W206%2C_front_8.3.22.jpg/1280px-2022_Mercedes-Benz_C-class_W206%2C_front_8.3.22.jpg", "v1"],
    // BMW X5 xDrive40d (G05)
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/2019_BMW_X5_xDrive30d_M_Sport_%28G05%29_front_8.4.19.jpg/1280px-2019_BMW_X5_xDrive30d_M_Sport_%28G05%29_front_8.4.19.jpg", "v2"],
    // Dacia Sandero Stepway — Caradisiac officiel
    ["https://images.caradisiac.com/logos/3/8/3/6/263836/S8-essai-dacia-sandero-stepway-2021-le-choix-malin-187126.jpg", "v3"],
    // Range Rover Sport HSE (L461)
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/2023_Range_Rover_Sport_HSE_Dynamic_front.jpg/1280px-2023_Range_Rover_Sport_HSE_Dynamic_front.jpg", "v4"],
    // Audi A6 (C8)
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/2018_Audi_A6_Limousine_%28C8%29%2C_front_8.4.19.jpg/1280px-2018_Audi_A6_Limousine_%28C8%29%2C_front_8.4.19.jpg", "v5"],
    // Porsche 911 Carrera (992)
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/2019_Porsche_911_Carrera_S_%28992%29%2C_front_8.4.19.jpg/1280px-2019_Porsche_911_Carrera_S_%28992%29%2C_front_8.4.19.jpg", "v6"],
    // VW Golf 8 R-Line
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/2020_Volkswagen_Golf_Style_1.5_TSI_Front.jpg/1280px-2020_Volkswagen_Golf_Style_1.5_TSI_Front.jpg", "v7"],
    // Jeep Wrangler Rubicon (JL)
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/2019_Jeep_Wrangler_Rubicon_%28JL%29%2C_front_4.14.19.jpg/1280px-2019_Jeep_Wrangler_Rubicon_%28JL%29%2C_front_4.14.19.jpg", "v8"],
    // Toyota Land Cruiser Prado (J150)
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/2018_Toyota_Land_Cruiser_Prado_%28J150%2C_facelift%29_GXL_2.8_TD_Front.jpg/1280px-2018_Toyota_Land_Cruiser_Prado_%28J150%2C_facelift%29_GXL_2.8_TD_Front.jpg", "v9"],
    // Tesla Model 3 Performance
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2019_Tesla_Model_3_Performance_AWD%2C_front_8.6.19.jpg/1280px-2019_Tesla_Model_3_Performance_AWD%2C_front_8.6.19.jpg", "v10"],
  ];

  let done = 0;
  updates.forEach(([url, id]) => {
    db.query("UPDATE vehicles SET image_url = ? WHERE id = ?", [url, id], (err) => {
      if (err) console.error(`Erreur pour ${id}:`, err.message);
      else console.log(`✅ ${id} mis à jour`);
      done++;
      if (done === updates.length) {
        console.log("\nToutes les photos ont été mises à jour !");
        db.end();
      }
    });
  });
});
