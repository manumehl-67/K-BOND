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
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL
  )
`).run();

const insert = db.prepare(`
  INSERT INTO users (username, password, email, name, surname) 
  VALUES (@username, @password, @email, @name, @surname)
`);

const selectAll = db.prepare('SELECT * FROM users');

app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => {
  // Destructuring der neuen Felder aus dem Body
  const { username, password, email, name, surname } = req.body;

  try {
    insert.run({
      username: username,
      password: password,
      email: email,
      name: name,
      surname: surname
    });

    res.status(201).send("User erfolgreich mit allen Details erstellt");
  } catch (err) {
    res.status(400).send("Fehler beim Erstellen des Users: " + err.message);
  }
});

// Beispiel: Nutzer hinzufügen (Route)
app.get('/users', (req, res) => {
  const users = db.prepare('SELECT id, username, email, name, surname FROM users').all();
  res.json(users);
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));