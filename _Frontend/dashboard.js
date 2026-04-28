//GLOBAL VARIABLES
let edit_profile_button = document.getElementById("edit_profile_button")
let surname_name = document.getElementById("surname_name");
let profile_username = document.getElementById("profile_username");
let display_age = document.getElementById("display_age");
let display_interests = document.getElementById("display_interests");
let display_relationship = document.getElementById("display_relationship");
const userJson = localStorage.getItem("loggedInUser");
const editBtn = document.getElementById("edit_profile_button");
const editContainer = document.getElementById("edit_container");
const saveBtn = document.getElementById("save_profile_button");
const cancelBtn = document.getElementById("cancel_edit_button");

//FUNCTIONS
if (userJson) {
    const user = JSON.parse(userJson);

    // Prüfe, ob dein Backend 'name', 'username' oder 'surname' sendet.
    // Ich nutze hier 'name', pass es ggf. an das an, was in deiner DB steht.
    const displayName = user.surname + " " + user.name || user.username || "User";

    document.getElementById("welcome_text").innerText = `Welcome back, ${displayName}!`;
    document.getElementById("display_profile_pic").src = `http://localhost:3000/profile-pic/${user.username}`;
    document.getElementById("surname_name").innerText = `${user.surname} ${user.name}`;
    document.getElementById("profile_username").innerText = `@${user.username}`;
    document.getElementById("display_age").innerText = user.age || "Not specified";
    document.getElementById("display_interests").innerText = user.interests || "Not specified";
    document.getElementById("display_relationship").innerText = user.relationship || "Not specified";
} else {
    // Falls kein User im Speicher ist -> zurück zum Login
    window.location.href = 'index.html';
}

// LOGOUT FUNCTION
document.getElementById("logout_button").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser"); // Speicher leeren
    window.location.href = 'index.html';    // Zurück zum Login
});

//EVENT-LISTENERS
// 1. Klick auf "Profil bearbeiten" -> Zeigt das Formular

edit_profile_button.addEventListener("click", () => {
    // 1. Hol dir die aktuellen Werte aus der Anzeige (oder aus dem localStorage)
    const currentAge = document.getElementById("display_age").innerText;
    const currentInterests = document.getElementById("display_interests").innerText;
    const currentRelationship = document.getElementById("display_relationship").innerText;

    // 2. Fülle die Eingabefelder im "Bearbeiten"-Bereich voraus
    // Wir prüfen auf '-', falls noch nichts eingetragen wurde
    document.getElementById("edit_age").value = currentAge === '-' ? '' : currentAge;
    document.getElementById("edit_interests").value = currentInterests === '-' ? '' : currentInterests;
    
    // Bei dem Select-Feld (Beziehungsstatus) muss der Wert exakt mit der 'value' der Option übereinstimmen
    const relSelect = document.getElementById("edit_relationship");
    if (currentRelationship) {
        relSelect.value = currentRelationship.toLowerCase(); 
    }

    // 3. Erst jetzt den Container anzeigen
    editContainer.classList.remove("hidden");
});

// 2. Klick auf "Abbrechen" -> Versteckt das Formular
cancelBtn.addEventListener("click", () => {
    editContainer.classList.add("hidden");
    document.getElementById("user_profile").classList.remove("hidden");
});

// 3. Klick auf "Speichern" -> Daten ans Backend senden
saveBtn.addEventListener("click", async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const fileInput = document.getElementById("profile_pic_input"); // Das neue Input-Feld

    // TEIL 1: BILD HOCHLADEN (falls eines ausgewählt wurde)
    if (fileInput && fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('profilePic', fileInput.files[0]);
        formData.append('username', loggedInUser.username);

        try {
            const imgResponse = await fetch('http://localhost:3000/upload-profile-pic', {
                method: 'POST',
                body: formData
            });
            const imgResult = await imgResponse.json();
            if (imgResponse.ok) {
                // Pfad im lokalen Speicher aktualisieren
                loggedInUser.profile_pic = imgResult.imagePath;
            }
        } catch (error) {
            console.error("Fehler beim Bildupload:", error);
        }
    }

    // TEIL 2: RESTLICHE PROFILDATEN SPEICHERN
    const updatedData = {
        username: loggedInUser.username,
        age: document.getElementById("edit_age").value,
        interests: document.getElementById("edit_interests").value,
        relationship: document.getElementById("edit_relationship").value
    };

    try {
        const response = await fetch('http://localhost:3000/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("Profil gespeichert!");
            // Alles im LocalStorage zusammenführen und speichern
            const newUserObj = { ...loggedInUser, ...updatedData };
            localStorage.setItem("loggedInUser", JSON.stringify(newUserObj));


            // editContainer.classList.add("hidden");
            location.reload(); // Seite neu laden, um Änderungen zu sehen
        }
    } catch (error) {
        console.error("Fehler:", error);
    }
});

const searchInput = document.getElementById("search_input");
const searchResults = document.getElementById("search_results");

searchInput.addEventListener("input", async () => {
    const query = searchInput.value;

    if (query.length < 2) { // Suche startet erst ab 2 Buchstaben
        searchResults.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/search?q=${query}`);
        const users = await response.json();

        // Ergebnisse anzeigen
        searchResults.innerHTML = ""; // Vorherige Ergebnisse löschen

        // In dashboard.js innerhalb der users.forEach Schleife:
        users.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.className = "search-item";
            
            // Wir bauen die Buttons in ein eigenes Div für besseres Styling
            userDiv.innerHTML = `
                <div id="user_info">
                    <div id="search_profile_pic">
                        <img src="http://localhost:3000/profile-pic/${user.username}" alt="Profilbild" class="search-profile-pic" onerror="this.onerror=null; this.src='assets/default-avatar.png';"
                        style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-right: 10px;">
                    </div>
                    <div id="search_user_info">
                        <p style="font-size: 1.2em;"><strong>${user.surname} ${user.name}</strong></p>
                        <p>@${user.username}</p>
                    </div>
                </div>
                <div class="button-group">
                    <button class="buttons" onclick="viewProfile(${user.id})">View Profile</button>
                    <button class="buttons follow-btn" onclick="followUser(${user.id})">Follow</button>
                </div>
            `;
            searchResults.appendChild(userDiv);
        });
    } catch (error) {
        console.error("Fehler bei der Suche:", error);
    }
});

// Angepasse displayUsers Funktion in dashboard.js
function displayUsers(users) {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    searchResults.innerHTML = ""; 

    users.forEach(user => {
        if (user.id === currentUser.id) return; // Sich selbst nicht anzeigen

        const userDiv = document.createElement("div");
        userDiv.className = "search-item";
        userDiv.innerHTML = `
            <p><strong>${user.name} ${user.surname}</strong> (@${user.username})</p>
            <div class="button-group">
                <button class="buttons" onclick="viewProfile(${user.id})">View Profile</button>
                <button class="buttons follow-btn" onclick="followUser(${user.id})">Follow</button>
            </div>
        `;
        searchResults.appendChild(userDiv);
    });
}

async function loadFollowingList() {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!currentUser) return;

    try {
        const response = await fetch(`http://localhost:3000/following-list/${currentUser.id}`);
        const followingUsers = await response.json();
        const listContainer = document.getElementById("following_list");
        
        listContainer.innerHTML = ""; // Leeren

        if (followingUsers.length === 0) {
            listContainer.innerHTML = '<p class="empty-msg">You are not following anyone yet.</p>';
            return;
        }

        followingUsers.forEach(user => {
            const item = document.createElement("div");
            item.className = "following-item";
            item.onclick = () => viewProfile(user.id); // Nutzt deine vorhandene Funktion

            item.innerHTML = `
                <img src="http://localhost:3000/profile-pic/${user.username}" 
                     class="following-pic-mini" 
                     onerror="this.src='assets/default-avatar.png'"
                     style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 10px;">

                <div class="following-name">${user.name} ${user.surname}</div>
            `;
            listContainer.appendChild(item);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Following-Liste:", error);
    }
}

// FUNKTION: Jemandem folgen
async function followUser(followingId) {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    try {
        const response = await fetch('http://localhost:3000/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followerId: currentUser.id, followingId: followingId })
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);

        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error("Follow-Fehler:", error);
    }
    loadFollowingList(); // Liste neu laden, um die Änderung zu sehen
}

// FUNKTION: Profil-Details in einem Modal/Pop-up anzeigen
async function viewProfile(userId) {
    try {
        const response = await fetch(`http://localhost:3000/user-profile/${userId}`);
        const user = await response.json();

        // Einfaches Alert erstellt
        alert(`
            Profile of ${user.name} ${user.surname}
            -----------------------------------
            Username: @${user.username}
            Age: ${user.age || '-'}
            Interests: ${user.interests || '-'}
            Relationship Status: ${user.relationship || '-'}
            -----------------------------------
            Follower: ${user.followers} | Following: ${user.following}
        `);
    } catch (error) {
        alert("Fehler beim Laden des Profils");
    }
}

// Funktion, um die eigenen Follower-Zahlen zu laden
async function loadMyStats() {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!currentUser) return;

    try {
        const response = await fetch(`http://localhost:3000/user-profile/${currentUser.id}`);
        const data = await response.json();
        
        // Den Text im HTML aktualisieren (ID: my_stats muss im HTML existieren)
        const statsElement = document.getElementById("my_stats");
        if (statsElement) {
            statsElement.innerText = `Follower: ${data.followers} | Following: ${data.following}`;
        }
    } catch (error) {
        console.error("Fehler beim Laden der Stats:", error);
    }
}

// Diese Funktion beim Start aufrufen
loadMyStats();  

// Erweiterte viewProfile-Funktion mit Modal
async function viewProfile(userId) {
    const modal = document.getElementById("profile_modal");
    const closeBtn = document.getElementById("close_modal");

    try {
        const response = await fetch(`http://localhost:3000/user-profile/${userId}`);
        const user = await response.json();

        // Daten in das Modal füllen
        document.getElementById("modal_name").innerText = `${user.name} ${user.surname}`;
        document.getElementById("modal_username").innerText = `@${user.username}`;
        document.getElementById("modal_age").innerText = user.age || '-';
        document.getElementById("modal_interests").innerText = user.interests || '-';
        document.getElementById("modal_relationship").innerText = user.relationship || '-';
        document.getElementById("modal_stats").innerText = `Follower: ${user.followers} | Following: ${user.following}`;
        
        // Profilbild laden (Nutzt die Route aus dem Backend)
        document.getElementById("modal_profile_pic").src = `http://localhost:3000/profile-pic/${user.username}`;

        // Follow-Button Funktionalität im Modal
        const followBtn = document.getElementById("modal_follow_btn");
        followBtn.onclick = () => followUser(user.id);

        // Modal anzeigen
        modal.classList.remove("hidden");

        // Schließen-Logik
        closeBtn.onclick = () => modal.classList.add("hidden");
        window.onclick = (event) => {
            if (event.target == modal) modal.classList.add("hidden");
        };

    } catch (error) {
        console.error("Fehler beim Laden des Profils:", error);
        alert("Profil konnte nicht geladen werden.");
    }
}

loadFollowingList();