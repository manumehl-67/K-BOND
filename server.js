const express = require('express');
const Database = require('better-sqlite3'); // Viel einfacher!
const path = require('path');

const app = express();
const db = new Database('database.db'); // Erstellt die Datei sofort, wenn nicht vorhanden

// Tabelle erstellen
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`).run();

// Beispiel: Nutzer hinzufügen (Route)
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    insert.run(username, password);
    res.send("Registriert!");
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));