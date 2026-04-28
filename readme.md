K-BOND ist eine soziale Netzwerk-Plattform für die Kanti Olten. Nutzer können sich registrieren, ein Profil mit Interessen und Beziehungsstatus erstellen, nach anderen Mates suchen und einander folgen.


In diesem Projekt sind folgende Bereiche enthalten:

- Frontend:

      - Für den eingeloggten Bereich wurden dashboard.html (Struktur) und dashboard.js (Interaktion) erstellt.
      - Für die Startseite der wurde index.html und script.js erstellt.
      - Mit styles.css wurde das Design gestaltet.

- Backend:

      - server.js als Laufzeitumgebung für den Server
      - node_modules:
        - SQLite (better-sqlite3): Eine leichtgewichtige, dateibasierte Datenbank.
        - Bcrypt: Zur sicheren Verschlüsselung der Passwörter (Hashing).
        - Cors: Ermöglicht die Kommunikation zwischen Frontend und Backend.
        - Multer: Vorbereitet für den Upload von Dateien (Profilbildern).


Um das Projekt lokal zu starten, müssen folgende Schritte ausgeführt werden:

1. Github-Release herunterladen
2. Node installieren.
        Link: https://nodejs.org/en/download
4. Server starten
    Im Terminal eingeben:
        cd backend
        node server.js
5. Frontend öffnen
    index.html im Browser öffnen via "Go Live"


Die Features unseres Programms:

- Authentifizierung: Registrierung mit E-Mail-Validierung (@kantiolten.ch) und sicherer Login.
- Profil-Verwaltung: Bearbeiten von Alter, Interessen und Beziehungsstatus.
- Social Search: Suche nach Benutzernamen oder echten Namen.
- Follow-System: Anderen Nutzern folgen mit Echtzeit-Update des Follower-Zählers.


Anmerkung:

Die Passwörter werden nicht im Klartext, sondern als Hash in der SQLite-Datenbank gespeichert.



Programmierer: 

Manuel Eicher (G22aM), Moritz Gächter (G22aB)

    