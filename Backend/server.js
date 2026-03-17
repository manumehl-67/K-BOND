const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt'); // 1. Schritt: Importieren

const app = express();
const cors = require('cors');
const db = new Database('database.db');

// Tabelle (bleibt gleich, aber stell sicher, dass die .db Datei gelöscht wurde!)
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

app.use(cors());
app.use(express.json());

// 2. Schritt: Route auf 'async' setzen
app.post('/register', async (req, res) => {
  const { username, password, email, name, surname } = req.body;

  try {
    // 3. Schritt: Passwort hashen
    const saltRounds = 10; // Stärke der Verschlüsselung
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Schritt: Das GEHASHte Passwort in die DB schreiben
    insert.run({
      username: username,
      password: hashedPassword,
      email: email,
      name: name,
      surname: surname
    });

    res.status(201).send("User sicher erstellt!");
  } catch (err) {
    res.status(400).send("Fehler: " + err.message);
  }
});

app.get('/users', (req, res) => {
  const users = db.prepare('SELECT id, username, password, email, name, surname FROM users').all();
  res.json(users);
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));