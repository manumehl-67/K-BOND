//GLOBAL VARIABLES
let edit_profile_button = document.getElementById("edit_profile_button")
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
    const displayName = user.name + " " + user.surname || user.username || "User";

    document.getElementById("welcome_text").innerText = `Welcome back, ${displayName}!`;
    document.getElementById("display_profile_pic").src = `http://localhost:3000/profile-pic/${user.username}`;
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
editBtn.addEventListener("click", () => {
    editContainer.classList.remove("hidden");
});

// 2. Klick auf "Abbrechen" -> Versteckt das Formular
cancelBtn.addEventListener("click", () => {
    editContainer.classList.add("hidden");
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
