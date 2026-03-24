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

// Login-Route (Muss in die server.js!)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. User suchen
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ error: "Benutzer nicht gefunden" });
    }

    // 2. Passwort vergleichen (Eingabe vs. Hash aus DB)
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Erfolg: Schicke User-Daten (ohne Passwort!) zurück
      res.json({
        message: "Login erfolgreich",
        user: { surname: user.surname, username: user.username }
      });
    } else {
      res.status(401).json({ error: "Passwort falsch" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));