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
    // Optional: Hier könntest du bereits vorhandene Daten in die Felder laden
});

// 2. Klick auf "Abbrechen" -> Versteckt das Formular
cancelBtn.addEventListener("click", () => {
    editContainer.classList.add("hidden");
});

// 3. Klick auf "Speichern" -> Daten ans Backend senden
saveBtn.addEventListener("click", async () => {
    const updatedData = {
        username: JSON.parse(localStorage.getItem("loggedInUser")).username,
        age: document.getElementById("edit_age").value,
        interests: document.getElementById("edit_interests").value,
        relationship: document.getElementById("edit_relationship").value
    };
});
    // Hier kommt später der fetch-Aufruf ans Backend