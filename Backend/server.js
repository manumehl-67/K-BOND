const express = require('express');
const Database = require('better-sqlite3'); // Viel einfacher!
const path = require('path');

const app = express();
const cors = require('cors');
const db = new Database('database.db'); // Erstellt die Datei sofort, wenn nicht vorhanden

// Tabelle erstellen
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`).run();

const insert = db.prepare(
  'INSERT INTO users (username, password) VALUES (@username, @password)'
);

const selectAll = db.prepare('SELECT * FROM users');

app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  console.log(`Registrierungsanfrage: ${username}, ${password}`);
  insert.run({
    "username": username,
    "password": password
  });

  res.send("User erstellt");
});


// Beispiel: Nutzer hinzufügen (Route)
app.get('/users', (req, res) => {
  console.log("Users wurde ausgeführt. Hier kommt funktionalität, so dass Benutzer zurückgesendet werden")
  res.send("USERS!!");
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));