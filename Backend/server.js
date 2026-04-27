const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt'); // 1. Schritt: Importieren

const app = express();
const cors = require('cors');
const db = new Database('database.db');

const multer = require('multer');

// Konfiguration: Wo und wie werden Bilder gespeichert?
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pfad zum Ordner
  },
  filename: (req, file, cb) => {
    // Name: Zeitstempel + Originalname (verhindert Duplikate)
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Tabelle (bleibt gleich, aber stell sicher, dass die .db Datei gelöscht wurde!)
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    age INTEGER,
    interests TEXT,
    relationship TEXT,
    profile_pic TEXT
  )
`).run();

// Neue Tabelle für die Follower-Beziehungen
db.prepare(`
  CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER,
    following_id INTEGER,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id)
  )
`).run();

const insert = db.prepare(`
  INSERT INTO users (username, password, email, name, surname) 
  VALUES (@username, @password, @email, @name, @surname)
`);

app.use(cors());
app.use(express.json());

//BILD UPLOAD//
app.use('/uploads', express.static('uploads'));

// Neue Route für den Bildupload
app.post('/upload-profile-pic', upload.single('profilePic'), (req, res) => {
  const { username } = req.body;
  const imagePath = `/uploads/${req.file.filename}`; // Der Link zum Bild

  try {
    const update = db.prepare('UPDATE users SET profile_pic = ? WHERE username = ?');
    update.run(imagePath, username);
    res.json({ message: "Bild hochgeladen!", imagePath: imagePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/profile-pic/:username", (req, res) => {
  const { username } = req.params;
  const user = db.prepare('SELECT profile_pic FROM users WHERE username = ?').get(username);
  if (user.profile_pic) {
    res.sendFile(path.resolve("../Backend/" + user.profile_pic));
  } else {
    res.status(404).json({ error: "Bild nicht gefunden" });
  }
});

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
      // server.js -> app.post('/login', ...)
res.json({
    message: 'Login erfolgreich',
    user: { 
        id: user.id, 
        username: user.username, 
        name: user.name, 
        surname: user.surname,
        age: user.age,
        interests: user.interests,
        relationship: user.relationship,
        profile_pic: user.profile_pic
    }
});
    } else {
      res.status(401).json({ error: "Passwort falsch" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/update-profile', (req, res) => {
  const { username, age, interests, relationship } = req.body;

  try {
    const update = db.prepare(`
            UPDATE users 
            SET age = ?, interests = ?, relationship = ? 
            WHERE username = ?
        `);

    const result = update.run(age, interests, relationship, username);

    if (result.changes > 0) {
      res.json({ message: "Profil erfolgreich aktualisiert!" });
    } else {
      res.status(404).json({ error: "Benutzer nicht gefunden" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/search', (req, res) => {
    const query = req.query.q; // Der Suchbegriff aus der URL
    
    if (!query) {
        return res.json([]);
    }

    try {
        // Wir suchen im username ODER im name
        // %query% bedeutet: Text davor oder danach ist egal
        const users = db.prepare(`
            SELECT id, username, name, surname, interests 
            FROM users 
            WHERE username LIKE ? OR name LIKE ?
        `).all(`%${query}%`, `%${query}%`);

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Jemandem folgen
app.post('/follow', (req, res) => {
    const { followerId, followingId } = req.body;
    if (followerId === followingId) return res.status(400).json({ error: "Du kannst dir nicht selbst folgen" });

    try {
        const insert = db.prepare('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)');
        insert.run(followerId, followingId);
        res.json({ message: "Erfolgreich gefolgt!" });
    } catch (err) {
        res.status(400).json({ error: "Du folgst dieser Person bereits" });
    }
});

// 2. Profil-Details eines anderen Users abrufen
// In server.js
app.get('/user-profile/:id', (req, res) => {
    const userId = req.params.id;
    try {
        // profile_pic zum SELECT hinzugefügt
        const user = db.prepare('SELECT id, username, name, surname, age, interests, relationship, profile_pic FROM users WHERE id = ?').get(userId);
        
        const followers = db.prepare('SELECT COUNT(*) as count FROM follows WHERE following_id = ?').get(userId).count;
        const following = db.prepare('SELECT COUNT(*) as count FROM follows WHERE follower_id = ?').get(userId).count;

        res.json({ ...user, followers, following });
    } catch (err) {
        res.status(404).json({ error: "User nicht gefunden" });
    }
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));